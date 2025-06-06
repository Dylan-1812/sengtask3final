export const DEMO_USER = {
  email: "demo@tailtrails.com",
  password: "demo123456",
  profile: {
    id: "demo-user-id",
    first_name: "Demo",
    last_name: "User",
    username: "demo_user",
    avatar_url: "/placeholder.svg?height=40&width=40",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  stats: {
    parks_visited: 12,
    photos_shared: 28,
    friends: 15,
    reviews_written: 8,
  },
  recent_activity: [
    {
      id: "1",
      type: "park_visit",
      park_name: "Centennial Park",
      date: "2024-01-15",
      description: "Visited with Max - great off-leash area!",
    },
    {
      id: "2",
      type: "photo_share",
      park_name: "Hyde Park",
      date: "2024-01-14",
      description: "Shared a photo of Bella playing fetch",
    },
    {
      id: "3",
      type: "review",
      park_name: "Bicentennial Park",
      date: "2024-01-13",
      description: "Left a 5-star review - excellent facilities",
    },
  ],
}

export function isDemoUser(email: string): boolean {
  return email === DEMO_USER.email
}

export function getDemoUserData() {
  return {
    user: {
      id: DEMO_USER.profile.id,
      email: DEMO_USER.email,
      created_at: DEMO_USER.profile.created_at,
      updated_at: DEMO_USER.profile.updated_at,
      email_confirmed_at: DEMO_USER.profile.created_at,
      user_metadata: {
        first_name: DEMO_USER.profile.first_name,
        last_name: DEMO_USER.profile.last_name,
        username: DEMO_USER.profile.username,
      },
    },
    profile: DEMO_USER.profile,
  }
}
