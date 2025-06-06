import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DebugPage() {
  const supabase = await createClient()

  // Check current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  // Check profiles table
  const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*").limit(5)

  // Check auth users (this might not work due to RLS)
  const { data: authUsers, error: authError } = await supabase.from("auth.users").select("*").limit(5)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Debug Information</h1>

        <Card>
          <CardHeader>
            <CardTitle>Current User</CardTitle>
          </CardHeader>
          <CardContent>
            {userError ? (
              <p className="text-red-600">Error: {userError.message}</p>
            ) : user ? (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(user, null, 2)}</pre>
            ) : (
              <p>No user logged in</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profiles Table</CardTitle>
          </CardHeader>
          <CardContent>
            {profilesError ? (
              <p className="text-red-600">Error: {profilesError.message}</p>
            ) : profiles && profiles.length > 0 ? (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(profiles, null, 2)}</pre>
            ) : (
              <p>No profiles found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{" "}
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
              </p>
              <p>
                <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{" "}
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}
              </p>
              <p>
                <strong>NEXT_PUBLIC_SITE_URL:</strong> {process.env.NEXT_PUBLIC_SITE_URL ? "✅ Set" : "❌ Missing"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
