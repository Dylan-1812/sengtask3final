"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"
import { simpleSignUp } from "@/lib/auth/actions"
import { createClient } from "@/lib/supabase/client"

export default function WorkingTestPage() {
  const [formData, setFormData] = useState({
    email: "test@example.com",
    password: "password123",
    firstName: "Test",
    lastName: "User",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSimpleSignup = async () => {
    setIsLoading(true)
    setResult("")

    try {
      const result = await simpleSignUp(formData.email, formData.password, formData.firstName, formData.lastName)
      setResult(JSON.stringify(result, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDirectSignin = async () => {
    setIsLoading(true)
    setResult("")

    try {
      const supabase = createClient()

      // First confirm the user
      const { data: confirmResult } = await supabase.rpc("confirm_user_email", {
        user_email: formData.email,
      })

      console.log("Confirmation result:", confirmResult)

      // Then try to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
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

  const handleConfirmAllUsers = async () => {
    setIsLoading(true)
    setResult("")

    try {
      const supabase = createClient()

      const { data, error } = await supabase.rpc("confirm_all_unconfirmed_users")

      if (error) {
        setResult(`Confirmation error: ${error.message}`)
      } else {
        setResult(`Confirmed ${data} users`)
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
        <h1 className="text-3xl font-bold">Working Authentication Test</h1>

        <Card>
          <CardHeader>
            <CardTitle>Test Authentication Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
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
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
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

            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleSimpleSignup} disabled={isLoading}>
                1. Simple Signup
              </Button>
              <Button onClick={handleConfirmAllUsers} disabled={isLoading} variant="outline">
                2. Confirm All Users
              </Button>
              <Button onClick={handleDirectSignin} disabled={isLoading} variant="outline">
                3. Direct Sign In
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
            <CardTitle>Step-by-Step Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Click "1. Simple Signup" to create a test user</li>
              <li>Click "2. Confirm All Users" to confirm email addresses</li>
              <li>Click "3. Direct Sign In" to test login</li>
              <li>If this works, try the regular signup/login pages</li>
              <li>Check browser console for detailed logs</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
