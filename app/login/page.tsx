"use client"

import type React from "react"

import { useState, useTransition, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Eye, EyeOff, Loader2, Zap } from "lucide-react"
import { signIn } from "@/lib/auth/actions"
import { SimpleCaptcha } from "@/components/simple-captcha"
import { createDemoSession } from "@/lib/auth/demo-session"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const message = searchParams.get("message")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isPending, startTransition] = useTransition()
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  // Demo credentials
  const demoCredentials = {
    email: "demo@tailtrails.com",
    password: "demo123456",
  }

  // Pre-fill email if coming from signup
  useEffect(() => {
    const signupEmail = sessionStorage.getItem("signupEmail")
    if (signupEmail) {
      setFormData((prev) => ({ ...prev, email: signupEmail }))
      sessionStorage.removeItem("signupEmail")
    }

    if (message) {
      setSuccessMessage(message)
    }
  }, [message])

  const handleDemoLogin = async () => {
    setIsDemoLoading(true)
    setError("")

    try {
      console.log("Starting demo login process...")

      // Pre-fill form for visual feedback
      setFormData(demoCredentials)
      setCaptchaVerified(true)

      // Create session with error handling
      const success = createDemoSession()
      console.log("Demo session creation result:", success)

      if (!success) {
        throw new Error("Failed to create demo session")
      }

      // Verify session was created
      const sessionCheck = localStorage.getItem("tail-trails-demo-session")
      console.log("Session verification:", !!sessionCheck)

      if (!sessionCheck) {
        throw new Error("Demo session not found after creation")
      }

      console.log("Navigating to dashboard...")

      // Try multiple navigation methods for better compatibility
      try {
        // Method 1: Next.js router
        await router.push("/dashboard?demo=true")
        console.log("Router navigation initiated")
      } catch (routerError) {
        console.warn("Router navigation failed, trying window.location:", routerError)
        // Method 2: Direct navigation
        window.location.href = "/dashboard?demo=true"
      }
    } catch (err) {
      console.error("Demo login error:", err)
      setError(`Demo login failed: ${err.message}. Please try again.`)
      setIsDemoLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    if (!captchaVerified) {
      setError("Please complete the CAPTCHA verification")
      return
    }

    console.log("Attempting to sign in with:", formData.email)

    startTransition(async () => {
      const formDataObj = new FormData()
      formDataObj.append("email", formData.email)
      formDataObj.append("password", formData.password)

      try {
        const result = await signIn(formDataObj)

        if (result?.error) {
          console.error("Sign in error:", result.error)
          setError(result.error)
        } else if (result?.isDemo) {
          // Handle demo login success
          console.log("Demo login successful, creating session and redirecting")
          createDemoSession()
          router.push(result.redirectTo || "/dashboard?demo=true")
        } else if (result?.success) {
          console.log("Regular login successful")
          // Regular login success - redirect will happen server-side
        } else {
          console.log("Sign in successful, should redirect to dashboard")
        }
      } catch (err) {
        console.error("Unexpected error during sign in:", err)
        setError("An unexpected error occurred. Please try again.")
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">TT</span>
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your Tail Trails account</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Demo Login Section - Prominent */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-bold text-blue-800">Try Demo Account</span>
                  <p className="text-xs text-blue-600">Instant access - no signup needed!</p>
                </div>
              </div>
              <Button
                type="button"
                size="lg"
                onClick={handleDemoLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
                disabled={isPending || isDemoLoading}
              >
                {isDemoLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Loading Demo...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />🚀 Instant Demo Access
                  </>
                )}
              </Button>

              {/* Debug info in development */}
              {process.env.NODE_ENV === "development" && isDemoLoading && (
                <div className="mt-2 text-xs text-gray-600">Debug: Creating demo session and navigating...</div>
              )}
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or sign in with your account</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {successMessage && (
                <Alert>
                  <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  required
                  disabled={isPending || isDemoLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    required
                    disabled={isPending || isDemoLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isPending || isDemoLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>

              {/* CAPTCHA */}
              <SimpleCaptcha onVerify={setCaptchaVerified} disabled={isPending || isDemoLoading} />

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-green-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isPending || isDemoLoading || !captchaVerified}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-green-600 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
