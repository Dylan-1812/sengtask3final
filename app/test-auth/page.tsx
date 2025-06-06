"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TestAuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const testSignUp = async () => {
    setIsLoading(true)
    setResult("")

    try {
      const formData = new FormData()
      formData.append("firstName", "Test")
      formData.append("lastName", "User")
      formData.append("email", email)
      formData.append("password", password)
      formData.append("confirmPassword", password)
      formData.append("mathAnswer", "5")
      formData.append("mathCorrectAnswer", "5")

      const response = await fetch("/api/test-signup", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testSignIn = async () => {
    setIsLoading(true)
    setResult("")

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)

      const response = await fetch("/api/test-signin", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Authentication Testing</h1>

        <Card>
          <CardHeader>
            <CardTitle>Test Authentication</CardTitle>
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
              <Button onClick={testSignUp} disabled={isLoading || !email || !password}>
                Test Sign Up
              </Button>
              <Button onClick={testSignIn} disabled={isLoading || !email || !password}>
                Test Sign In
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
            <CardTitle>Troubleshooting Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>First, try signing up with a new email address</li>
              <li>Check your email inbox (and spam folder) for a verification email</li>
              <li>Click the verification link in the email</li>
              <li>Then try signing in with the same credentials</li>
              <li>Check the browser console for detailed error logs</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
