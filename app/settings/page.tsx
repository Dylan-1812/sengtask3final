import { redirect } from "next/navigation"
import { getUserProfile } from "@/lib/auth/actions"
import { SettingsClient } from "@/components/settings-client"

export default async function SettingsPage() {
  const userProfile = await getUserProfile()

  if (!userProfile) {
    redirect("/login")
  }

  return <SettingsClient userProfile={userProfile} />
}
