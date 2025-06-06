"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"

export default function TestProfilePage() {
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const testProfileCreation = async () => {
    setIsLoading(true)
    setResult("")

    try {
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setResult("No user logged in. Please sign in first.")
        return
      }

      // Try to create a profile manually
      const profileData = {
        id: user.id,
        first_name: "Test",
        last_name: "User",
        username: `test_${Math.random().toString(36).substring(2, 8)}`,
      }

      console.log("Creating profile with data:", profileData)

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .insert(profileData)
        .select()
        .single()

      if (profileError) {
        setResult(`Profile creation error: ${JSON.stringify(profileError, null, 2)}`)
      } else {
        setResult(`Profile created successfully: ${JSON.stringify(profile, null, 2)}`)
      }
    } catch (error) {
      setResult(`Unexpected error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const checkProfile = async () => {
    setIsLoading(true)
    setResult("")

    try {
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setResult("No user logged in. Please sign in first.")
        return
      }

      // Check for existing profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError) {
        setResult(`Profile check error: ${JSON.stringify(profileError, null, 2)}`)
      } else {
        setResult(`Profile found: ${JSON.stringify(profile, null, 2)}`)
      }
    } catch (error) {
      setResult(`Unexpected error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Test Profile Creation</h1>

        <Card>
          <CardHeader>
            <CardTitle>Profile Testing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={checkProfile} disabled={isLoading}>
                Check Profile
              </Button>
              <Button onClick={testProfileCreation} disabled={isLoading}>
                Create Profile
              </Button>
            </div>

            {result && (
              <Alert>
                <AlertDescription>
                  <pre className="whitespace-pre-wrap text-xs">{result}</pre>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>First, make sure you're signed in (use the test login page if needed)</li>
              <li>Click "Check Profile" to see if you have a profile</li>
              <li>If no profile exists, click "Create Profile" to create one manually</li>
              <li>Check the browser console for detailed error messages</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
