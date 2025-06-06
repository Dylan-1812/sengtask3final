// Demo user configuration
export const DEMO_USER = {
  email: "demo@tailtrails.com",
  password: "demo123456",
  profile: {
    id: "demo-user-id",
    first_name: "Demo",
    last_name: "User",
    username: "demo_user",
    avatar_url: "/placeholder.svg?height=40&width=40",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
}

export function isDemoUser(email: string): boolean {
  return email === DEMO_USER.email
}
