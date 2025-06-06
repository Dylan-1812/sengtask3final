"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { debugCheckUsers } from "@/lib/auth/actions"
import { createClient } from "@/lib/supabase/client"

export default function DebugUsersPage() {
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const checkUsers = async () => {
    setIsLoading(true)
    setResult("")

    try {
      const result = await debugCheckUsers()
      setResult(JSON.stringify(result, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const confirmAllUsers = async () => {
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

  const testSpecificUser = async () => {
    setIsLoading(true)
    setResult("")

    try {
      const supabase = createClient()

      // Test with a specific email
      const testEmail = "test@example.com"

      const { data, error } = await supabase.rpc("confirm_user_email", {
        user_email: testEmail,
      })

      if (error) {
        setResult(`User confirmation error: ${error.message}`)
      } else {
        setResult(`User confirmation result: ${data}`)
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
        <h1 className="text-3xl font-bold">Debug Users & Authentication</h1>

        <Card>
          <CardHeader>
            <CardTitle>User Database Debugging</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button onClick={checkUsers} disabled={isLoading}>
                Check Recent Users
              </Button>
              <Button onClick={confirmAllUsers} disabled={isLoading} variant="outline">
                Confirm All Users
              </Button>
              <Button onClick={testSpecificUser} disabled={isLoading} variant="outline">
                Test User Confirmation
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
            <CardTitle>Manual Steps to Fix Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                <strong>Go to your Supabase Dashboard</strong>
              </li>
              <li>
                <strong>Navigate to Authentication → Settings</strong>
              </li>
              <li>
                <strong>Scroll down to "Email Auth"</strong>
              </li>
              <li>
                <strong>Turn OFF "Enable email confirmations"</strong>
              </li>
              <li>
                <strong>Click "Save"</strong>
              </li>
              <li>
                <strong>Run the SQL scripts provided</strong>
              </li>
              <li>
                <strong>Click "Confirm All Users" above</strong>
              </li>
              <li>
                <strong>Try signing up and signing in again</strong>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alternative: Create New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              If the authentication issues persist, consider creating a new Supabase project with email confirmation
              disabled from the start. This is often the quickest solution for development.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
