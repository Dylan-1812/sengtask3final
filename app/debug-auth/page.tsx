import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function DebugAuthPage() {
  const supabase = await createClient()

  // Check current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  // Check session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  // Try to get some users from auth.users (this might fail due to RLS)
  let authUsers = null
  let authError = null
  try {
    const { data, error } = await supabase.rpc("get_auth_users_debug")
    authUsers = data
    authError = error
  } catch (e) {
    authError = e
  }

  // Check profiles table
  const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*").limit(10)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Authentication Debug Information</h1>

        {/* Environment Check */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>
                <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL ? "default" : "destructive"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
                </Badge>
                {process.env.NEXT_PUBLIC_SUPABASE_URL && (
                  <p className="text-xs text-gray-600 mt-1">{process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
                )}
              </div>
              <div>
                <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>
                <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}
                </Badge>
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && (
                  <p className="text-xs text-gray-600 mt-1">
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...
                  </p>
                )}
              </div>
              <div>
                <strong>NEXT_PUBLIC_SITE_URL:</strong>
                <Badge variant={process.env.NEXT_PUBLIC_SITE_URL ? "default" : "destructive"}>
                  {process.env.NEXT_PUBLIC_SITE_URL ? "✅ Set" : "❌ Missing"}
                </Badge>
                {process.env.NEXT_PUBLIC_SITE_URL && (
                  <p className="text-xs text-gray-600 mt-1">{process.env.NEXT_PUBLIC_SITE_URL}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current User */}
        <Card>
          <CardHeader>
            <CardTitle>Current User</CardTitle>
          </CardHeader>
          <CardContent>
            {userError ? (
              <div className="text-red-600">
                <strong>Error:</strong> {userError.message}
              </div>
            ) : user ? (
              <div className="space-y-2">
                <p>
                  <strong>ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Email Confirmed:</strong>
                  <Badge variant={user.email_confirmed_at ? "default" : "destructive"}>
                    {user.email_confirmed_at ? "✅ Yes" : "❌ No"}
                  </Badge>
                </p>
                <p>
                  <strong>Created:</strong> {user.created_at}
                </p>
                <p>
                  <strong>Last Sign In:</strong> {user.last_sign_in_at || "Never"}
                </p>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium">Full User Object</summary>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto mt-2">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <p className="text-gray-600">No user logged in</p>
            )}
          </CardContent>
        </Card>

        {/* Current Session */}
        <Card>
          <CardHeader>
            <CardTitle>Current Session</CardTitle>
          </CardHeader>
          <CardContent>
            {sessionError ? (
              <div className="text-red-600">
                <strong>Error:</strong> {sessionError.message}
              </div>
            ) : session ? (
              <div className="space-y-2">
                <p>
                  <strong>Access Token:</strong> {session.access_token.substring(0, 20)}...
                </p>
                <p>
                  <strong>Expires:</strong> {new Date(session.expires_at! * 1000).toLocaleString()}
                </p>
                <p>
                  <strong>Token Type:</strong> {session.token_type}
                </p>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium">Full Session Object</summary>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto mt-2">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <p className="text-gray-600">No active session</p>
            )}
          </CardContent>
        </Card>

        {/* Profiles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Profiles Table</CardTitle>
          </CardHeader>
          <CardContent>
            {profilesError ? (
              <div className="text-red-600">
                <strong>Error:</strong> {profilesError.message}
              </div>
            ) : profiles && profiles.length > 0 ? (
              <div>
                <p className="mb-4">
                  <strong>Found {profiles.length} profiles:</strong>
                </p>
                <div className="space-y-2">
                  {profiles.map((profile, index) => (
                    <div key={index} className="bg-gray-100 p-3 rounded">
                      <p>
                        <strong>ID:</strong> {profile.id}
                      </p>
                      <p>
                        <strong>Name:</strong> {profile.first_name} {profile.last_name}
                      </p>
                      <p>
                        <strong>Username:</strong> {profile.username}
                      </p>
                      <p>
                        <strong>Created:</strong> {profile.created_at}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No profiles found</p>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                <strong>Check Supabase Dashboard:</strong> Go to Authentication → Settings → Email Auth and make sure
                "Enable email confirmations" is turned OFF
              </li>
              <li>
                <strong>Verify Environment Variables:</strong> Make sure all environment variables are set correctly
                above
              </li>
              <li>
                <strong>Test Signup:</strong> Try creating a new account and check if "Email Confirmed" shows "Yes"
                above
              </li>
              <li>
                <strong>Check Console Logs:</strong> Open browser developer tools and check console for detailed error
                messages
              </li>
              <li>
                <strong>Database Connection:</strong> Verify that the profiles table exists and the trigger is working
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
