import { redirect } from "next/navigation"
import { getUserProfile } from "@/lib/auth/actions"
import { DashboardClient } from "@/components/dashboard-client"
import { getWeatherData } from "@/lib/weather"
import { Suspense } from "react"

export default async function DashboardPage() {
  const userProfile = await getUserProfile()

  if (!userProfile) {
    redirect("/login")
  }

  // Always try to get weather data, with built-in fallback handling
  const weatherData = await getWeatherData()

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardClient userProfile={userProfile} initialWeatherData={weatherData} />
    </Suspense>
  )
}

function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white font-bold text-xl">TT</span>
        </div>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  )
}
