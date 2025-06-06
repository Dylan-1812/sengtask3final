"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createTestUser } from "@/lib/auth/actions"
import { createClient } from "@/lib/supabase/client"

export default function TestLoginPage() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("password123")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateTestUser = async () => {
    setIsLoading(true)
    setResult("")

    try {
      const result = await createTestUser(email, password)
      setResult(JSON.stringify(result, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestSignIn = async () => {
    setIsLoading(true)
    setResult("")

    try {
      const supabase = createClient()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setResult(`Sign in error: ${error.message}`)
      } else {
        setResult(`Sign in successful!\nUser: ${data.user?.email}\nID: ${data.user?.id}`)
      }
    } catch (error) {
      setResult(`Unexpected error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckUser = async () => {
    setIsLoading(true)
    setResult("")

    try {
      const supabase = createClient()

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        setResult(`Get user error: ${error.message}`)
      } else if (user) {
        setResult(`Current user: ${user.email}\nConfirmed: ${user.email_confirmed_at ? "Yes" : "No"}`)
      } else {
        setResult("No user logged in")
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
        <h1 className="text-3xl font-bold">Test Authentication</h1>

        <Card>
          <CardHeader>
            <CardTitle>Direct Authentication Testing</CardTitle>
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

            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleCreateTestUser} disabled={isLoading}>
                Create Test User
              </Button>
              <Button onClick={handleTestSignIn} disabled={isLoading}>
                Test Sign In
              </Button>
              <Button onClick={handleCheckUser} disabled={isLoading} variant="outline">
                Check Current User
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
              <li>Click "Create Test User" to create a test account</li>
              <li>Click "Test Sign In" to try signing in with the test account</li>
              <li>Click "Check Current User" to see if you're logged in</li>
              <li>Check the browser console for detailed logs</li>
              <li>If sign in works here, try the regular login page</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
