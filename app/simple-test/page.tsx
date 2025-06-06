"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"

export default function SimpleTestPage() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("password123")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const testSimpleSignup = async () => {
    setIsLoading(true)
    setResult("")

    try {
      const supabase = createClient()

      console.log("Testing simple signup...")

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: "Test",
            last_name: "User",
            username: `test_${Math.random().toString(36).substring(2, 8)}`,
          },
        },
      })

      if (error) {
        setResult(`Signup error: ${error.message}`)
        return
      }

      if (!data.user) {
        setResult("No user returned from signup")
        return
      }

      setResult(`Signup successful!
User ID: ${data.user.id}
Email: ${data.user.email}
Email confirmed: ${data.user.email_confirmed_at ? "Yes" : "No"}
Session: ${data.session ? "Yes" : "No"}`)

      // Wait and check for profile
      setTimeout(async () => {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          setResult((prev) => prev + `\n\nProfile check: Error - ${profileError.message} (Code: ${profileError.code})`)
        } else {
          setResult((prev) => prev + `\n\nProfile found: ${JSON.stringify(profile, null, 2)}`)
        }
      }, 2000)
    } catch (error) {
      setResult(`Unexpected error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testRPCProfileCreation = async () => {
    setIsLoading(true)
    setResult("")

    try {
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setResult("No user logged in. Please sign up first.")
        return
      }

      // Try RPC function
      const { data, error } = await supabase.rpc("create_user_profile", {
        user_id: user.id,
        first_name: "Test",
        last_name: "User",
        username: `test_${Math.random().toString(36).substring(2, 8)}`,
      })

      if (error) {
        setResult(`RPC error: ${error.message}`)
      } else {
        setResult(`RPC success: ${JSON.stringify(data, null, 2)}`)
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
        <h1 className="text-3xl font-bold">Simple Authentication Test</h1>

        <Card>
          <CardHeader>
            <CardTitle>Test Signup & Profile Creation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={testSimpleSignup} disabled={isLoading}>
                Test Simple Signup
              </Button>
              <Button onClick={testRPCProfileCreation} disabled={isLoading} variant="outline">
                Test RPC Profile Creation
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
            <CardTitle>What This Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Direct Supabase signup without form validation</li>
              <li>Profile creation via database trigger</li>
              <li>RPC function for manual profile creation</li>
              <li>Row Level Security policy compliance</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
