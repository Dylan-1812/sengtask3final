"use client"

import { getDemoUserData } from "@/lib/demo-user"

const DEMO_SESSION_KEY = "tail-trails-demo-session"
const DEMO_FLAG_KEY = "demo-active"

export function createDemoSession() {
  if (typeof window === "undefined") {
    console.warn("createDemoSession called on server side")
    return false
  }

  try {
    const sessionData = {
      user: getDemoUserData().user,
      profile: getDemoUserData().profile,
      isDemo: true,
      createdAt: new Date().toISOString(),
    }

    // Store in localStorage for persistence
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(sessionData))

    // Store flag in sessionStorage for quick access
    sessionStorage.setItem(DEMO_FLAG_KEY, "true")

    // Verify storage worked
    const verification = localStorage.getItem(DEMO_SESSION_KEY)
    const flagVerification = sessionStorage.getItem(DEMO_FLAG_KEY)

    console.log("Demo session created:", {
      stored: !!verification,
      flagSet: flagVerification === "true",
      dataLength: verification?.length || 0,
    })

    return !!(verification && flagVerification)
  } catch (error) {
    console.error("Failed to create demo session:", error)
    return false
  }
}

export function getDemoSession() {
  if (typeof window === "undefined") return null

  try {
    // Quick check first
    const hasFlag = sessionStorage.getItem(DEMO_FLAG_KEY) === "true"
    if (!hasFlag) {
      console.log("No demo flag found")
      return null
    }

    const sessionData = localStorage.getItem(DEMO_SESSION_KEY)
    if (!sessionData) {
      console.log("No demo session data found")
      return null
    }

    const parsed = JSON.parse(sessionData)
    console.log("Demo session retrieved:", {
      hasUser: !!parsed.user,
      hasProfile: !!parsed.profile,
      isDemo: parsed.isDemo,
    })

    return parsed
  } catch (error) {
    console.error("Failed to get demo session:", error)
    return null
  }
}

export function clearDemoSession() {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(DEMO_SESSION_KEY)
    sessionStorage.removeItem(DEMO_FLAG_KEY)
    console.log("Demo session cleared")
  } catch (error) {
    console.error("Failed to clear demo session:", error)
  }
}

export function isDemoSessionActive() {
  if (typeof window === "undefined") return false

  try {
    const hasFlag = sessionStorage.getItem(DEMO_FLAG_KEY) === "true"
    const hasData = !!localStorage.getItem(DEMO_SESSION_KEY)

    const isActive = hasFlag && hasData
    console.log("Demo session check:", { hasFlag, hasData, isActive })

    return isActive
  } catch (error) {
    console.error("Failed to check demo session:", error)
    return false
  }
}

// Quick demo check for immediate use
export function quickDemoCheck() {
  if (typeof window === "undefined") return false

  try {
    return sessionStorage.getItem(DEMO_FLAG_KEY) === "true"
  } catch (error) {
    console.error("Failed quick demo check:", error)
    return false
  }
}
