"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { z } from "zod"
import { getDemoSession } from "@/lib/auth/demo-session"
import { isDemoUser, DEMO_USER } from "@/lib/auth/utils"

// Validation schemas
const signUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    mathAnswer: z.string(),
    mathCorrectAnswer: z.number(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => Number.parseInt(data.mathAnswer) === data.mathCorrectAnswer, {
    message: "Incorrect math answer",
    path: ["mathAnswer"],
  })

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
})

// Helper function to create and confirm demo user
async function createDemoUser() {
  const supabase = await createClient()

  console.log("Creating demo user...")

  try {
    // First, try to create the demo user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: "demo@tailtrails.com",
      password: "demo123456",
      options: {
        data: {
          first_name: "Demo",
          last_name: "User",
          username: "demo_user",
        },
      },
    })

    if (signUpError) {
      console.error("Demo user creation failed:", signUpError)
      return { error: signUpError.message }
    }

    if (!authData.user) {
      return { error: "No user returned from demo signup" }
    }

    console.log("Demo user created, ID:", authData.user.id)

    // Wait a moment for the user to be fully created
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Force confirm the demo user using our new function
    const { data: confirmResult, error: confirmError } = await supabase.rpc("force_confirm_user", {
      user_email: "demo@tailtrails.com",
    })

    if (confirmError) {
      console.error("Demo user confirmation failed:", confirmError)
    } else {
      console.log("Demo user confirmation result:", confirmResult)
    }

    // Wait for confirmation to complete
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create profile for demo user
    const { data: profileResult, error: profileError } = await supabase.rpc("create_user_profile", {
      user_id: authData.user.id,
      first_name: "Demo",
      last_name: "User",
      username: "demo_user",
    })

    if (profileError) {
      console.error("Demo profile creation failed:", profileError)
    } else {
      console.log("Demo profile created:", profileResult)
    }

    return { success: true, userId: authData.user.id }
  } catch (error) {
    console.error("Demo user creation error:", error)
    return { error: `Failed to create demo user: ${error}` }
  }
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  // Parse and validate form data
  const data = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    mathAnswer: formData.get("mathAnswer") as string,
    mathCorrectAnswer: Number.parseInt(formData.get("mathCorrectAnswer") as string),
  }

  try {
    const validatedData = signUpSchema.parse(data)

    // Create username from first and last name
    const username = `${validatedData.firstName.toLowerCase()}_${validatedData.lastName.toLowerCase()}_${Math.random().toString(36).substring(2, 8)}`

    console.log("Attempting to sign up user:", validatedData.email)

    // Attempt signup
    const { data: authData, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        emailRedirectTo: undefined,
        data: {
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
          username: username,
        },
      },
    })

    if (error) {
      console.error("Signup error:", error)

      if (error.message.includes("User already registered")) {
        return { error: "An account with this email already exists. Please try signing in instead." }
      }

      return { error: error.message }
    }

    if (!authData.user) {
      return { error: "Failed to create user account" }
    }

    console.log("Signup successful:")
    console.log("- User ID:", authData.user.id)
    console.log("- Email:", authData.user.email)
    console.log("- Email confirmed:", authData.user.email_confirmed_at ? "Yes" : "No")
    console.log("- Session created:", authData.session ? "Yes" : "No")

    // If email is not confirmed, try to confirm it manually
    if (!authData.user.email_confirmed_at) {
      console.log("Email not confirmed, attempting manual confirmation...")

      try {
        const { data: confirmResult, error: confirmError } = await supabase.rpc("force_confirm_user", {
          user_email: validatedData.email,
        })

        if (confirmError) {
          console.error("Manual confirmation failed:", confirmError.message)
        } else {
          console.log("Manual confirmation result:", confirmResult)
        }
      } catch (confirmErr) {
        console.error("Manual confirmation error:", confirmErr)
      }
    }

    // Wait a moment for any triggers to complete
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Try to create profile using RPC function
    try {
      const { data: profileResult, error: profileError } = await supabase.rpc("create_user_profile", {
        user_id: authData.user.id,
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        username: username,
      })

      if (profileError) {
        console.error("Profile creation via RPC failed:", profileError.message)
      } else {
        console.log("Profile created via RPC:", profileResult)
      }
    } catch (profileErr) {
      console.error("Profile creation error:", profileErr)
    }

    // After the profile creation section, add automatic sign-in
    try {
      // Automatically sign in the new user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      })

      if (signInError) {
        console.error("Auto sign-in failed:", signInError)
        return {
          success: "Account created successfully! Please sign in with your credentials.",
          userId: authData.user.id,
          emailConfirmed: !!authData.user.email_confirmed_at,
          hasSession: false,
          autoSignInFailed: true,
        }
      }

      console.log("Auto sign-in successful for new user")

      return {
        success: "Account created successfully! Welcome to Tail Trails!",
        userId: authData.user.id,
        emailConfirmed: !!authData.user.email_confirmed_at,
        hasSession: !!signInData.session,
        autoSignedIn: true,
      }
    } catch (autoSignInError) {
      console.error("Auto sign-in error:", autoSignInError)
      return {
        success: "Account created successfully! Please sign in with your credentials.",
        userId: authData.user.id,
        emailConfirmed: !!authData.user.email_confirmed_at,
        hasSession: false,
        autoSignInFailed: true,
      }
    }
  } catch (error) {
    console.error("Sign up validation error:", error)
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "An unexpected error occurred during signup" }
  }
}

export async function signIn(formData: FormData) {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  console.log("Sign in attempt for:", data.email)

  // Validate input first
  let validatedData
  try {
    validatedData = signInSchema.parse(data)
  } catch (error) {
    console.error("Sign in validation error:", error)
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "An unexpected error occurred during sign in" }
  }

  // Check if this is a demo login
  if (isDemoUser(validatedData.email) && validatedData.password === DEMO_USER.password) {
    console.log("Demo login detected - returning success for client-side handling")
    // Return success indicator instead of redirecting
    return {
      success: "Demo login successful",
      isDemo: true,
      redirectTo: "/dashboard?demo=true",
    }
  }

  // For regular users, use Supabase
  const supabase = await createClient()

  try {
    // Try to confirm their email first
    try {
      const { data: confirmResult, error: confirmError } = await supabase.rpc("force_confirm_user", {
        user_email: validatedData.email,
      })

      if (!confirmError && confirmResult) {
        console.log("Pre-signin confirmation result:", confirmResult)
      }
    } catch (confirmErr) {
      console.log("Pre-signin confirmation not available:", confirmErr)
    }

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (error) {
      console.error("Sign in error details:", {
        message: error.message,
        status: error.status,
        name: error.name,
      })

      if (error.message.includes("Invalid login credentials")) {
        return {
          error: "Invalid email or password. Please check your credentials and try again.",
        }
      }

      if (error.message.includes("Email not confirmed")) {
        return {
          error: "Please verify your email address before signing in. Check your inbox for a verification email.",
        }
      }

      if (error.message.includes("Too many requests")) {
        return {
          error: "Too many login attempts. Please wait a few minutes before trying again.",
        }
      }

      return { error: error.message }
    }

    if (!authData.user) {
      console.error("No user returned from sign in")
      return { error: "Sign in failed. Please try again." }
    }

    console.log("Sign in successful for:", authData.user.email)

    // Ensure user has a profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single()

    if (profileError && profileError.code === "PGRST116") {
      console.log("No profile found during sign in, creating one...")

      try {
        const firstName = authData.user.user_metadata?.first_name || "User"
        const lastName = authData.user.user_metadata?.last_name || ""
        const username = authData.user.user_metadata?.username || `user_${authData.user.id.substring(0, 8)}`

        const { data: profileResult, error: createProfileError } = await supabase.rpc("create_user_profile", {
          user_id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          username: username,
        })

        if (createProfileError) {
          console.error("Failed to create profile during sign in:", createProfileError)
        } else {
          console.log("Profile created during sign in:", profileResult)
        }
      } catch (profileErr) {
        console.error("Profile creation error during sign in:", profileErr)
      }
    } else if (profile) {
      console.log("User profile found:", profile.username)
    }

    // Successful regular user sign in
    console.log("Regular user sign in successful, redirecting to dashboard")
  } catch (error) {
    console.error("Unexpected sign in error:", error)
    return { error: "An unexpected error occurred during sign in" }
  }

  // Redirect on successful sign in (outside try-catch)
  redirect("/dashboard")
}

export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Sign out error:", error)
    return { error: error.message }
  }

  redirect("/")
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
  }

  try {
    const validatedData = resetPasswordSchema.parse(data)

    const { error } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    })

    if (error) {
      console.error("Password reset error:", error)
      return { error: error.message }
    }

    return { success: "Password reset email sent! Check your inbox." }
  } catch (error) {
    console.error("Password reset validation error:", error)
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "An unexpected error occurred" }
  }
}

export async function getUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error("Get user error:", error)
    return null
  }

  return user
}

export async function getUserProfile() {
  // Check for demo session first (client-side only)
  if (typeof window !== "undefined") {
    const demoSession = getDemoSession()
    if (demoSession) {
      return {
        user: demoSession.user,
        profile: demoSession.profile,
        isDemo: true,
      }
    }
  }

  // Regular Supabase user lookup
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error && error.code !== "PGRST116") {
    console.error("Get user profile error:", error)
  }

  return { user, profile, isDemo: false }
}

// Debug function to check what users exist
export async function debugCheckUsers() {
  const supabase = await createClient()

  try {
    const { data: users, error } = await supabase.rpc("list_recent_users")

    if (error) {
      console.error("Debug users error:", error)
      return { error: error.message }
    }

    return { users }
  } catch (error) {
    console.error("Debug users unexpected error:", error)
    return { error: "Failed to check users" }
  }
}

// Simple signup function for testing
export async function simpleSignUp(email: string, password: string, firstName: string, lastName: string) {
  const supabase = await createClient()

  try {
    console.log("Simple signup for:", email)

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          username: `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${Math.random().toString(36).substring(2, 8)}`,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    if (!authData.user) {
      return { error: "No user returned from signup" }
    }

    // Try to confirm the user immediately
    const { data: confirmResult } = await supabase.rpc("force_confirm_user", {
      user_email: email,
    })

    console.log("Confirmation result:", confirmResult)

    return {
      success: "User created successfully",
      user: authData.user,
      confirmed: confirmResult,
    }
  } catch (error) {
    return { error: `Unexpected error: ${error}` }
  }
}

// Create test user function
export async function createTestUser(email: string, password: string) {
  const supabase = await createClient()

  try {
    console.log("Creating test user:", email)

    // First try to sign up
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: "Test",
          last_name: "User",
          username: `test_${Math.random().toString(36).substring(2, 8)}`,
        },
      },
    })

    if (signUpError) {
      return { error: signUpError.message }
    }

    if (!authData.user) {
      return { error: "No user returned from signup" }
    }

    // Confirm the user
    const { data: confirmResult } = await supabase.rpc("force_confirm_user", {
      user_email: email,
    })

    // Create profile
    const { data: profileResult } = await supabase.rpc("create_user_profile", {
      user_id: authData.user.id,
      first_name: "Test",
      last_name: "User",
      username: `test_${authData.user.id.substring(0, 8)}`,
    })

    return {
      success: "Test user created successfully",
      user: authData.user,
      confirmed: confirmResult,
      profile: profileResult,
    }
  } catch (error) {
    return { error: `Unexpected error: ${error}` }
  }
}
