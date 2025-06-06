"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  ThumbsUp,
  Users,
  Search,
  PawPrint,
  Heart,
  Bookmark,
  Bell,
  ImageIcon,
  MessageSquare,
} from "lucide-react"
import { sydneyDogParks } from "@/lib/parks-data"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Camera,
  Settings,
  Plus,
  Filter,
  MoreHorizontal,
  Share2,
  TrendingUp,
  Award,
  Target,
  Zap,
  Sun,
  CloudRain,
  Wind,
  Droplet,
  LogOut,
  Map,
  Navigation,
  Compass,
  Route,
  UserPlus,
  CalendarIcon,
} from "lucide-react"

// Get user data from localStorage
const getUserData = () => {
  if (typeof window === "undefined") return null

  try {
    // Check for new signup user
    const signupUser = localStorage.getItem("tailTrailsUser")
    if (signupUser) {
      return JSON.parse(signupUser)
    }

    // Check for demo user
    const demoUser = localStorage.getItem("demoUser")
    if (demoUser) {
      return JSON.parse(demoUser)
    }

    return null
  } catch (error) {
    console.error("Error getting user data:", error)
    return null
  }
}

// Create demo user data
const createDemoUser = () => {
  const demoData = {
    firstName: "Demo",
    lastName: "User",
    email: "demo@tailtrails.com",
    username: "demo_user",
    createdAt: new Date().toISOString(),
    isDemo: true,
  }

  localStorage.setItem("demoUser", JSON.stringify(demoData))
  return demoData
}

// Sign out function
const handleSignOut = () => {
  // Clear all user data
  localStorage.removeItem("tailTrailsUser")
  localStorage.removeItem("demoUser")

  // Redirect to home page
  window.location.href = "/"
}

export function DashboardClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isWelcome = searchParams?.get("welcome") === "true"
  const isNewUser = searchParams?.get("newUser") === "true"
  const isDemoMode = searchParams?.get("demo") === "true"

  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [weatherData, setWeatherData] = useState({
    temperature: 22,
    condition: "Partly Cloudy",
    icon: "🌤️",
    humidity: 65,
    windSpeed: 12,
    uvIndex: 6,
    precipitation: 0,
    sunrise: "6:30 AM",
    sunset: "7:45 PM",
  })

  const [stats, setStats] = useState({
    parksVisited: 12,
    reviewsWritten: 8,
    photosShared: 24,
    friendsConnected: 15,
    totalDistance: 45.2,
    favoriteParks: 6,
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "visit",
      park: "Parramatta Park",
      action: "visited",
      time: "2 hours ago",
      icon: MapPin,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      id: 2,
      type: "review",
      park: "Lake Parramatta Reserve",
      action: "reviewed",
      time: "1 day ago",
      icon: Star,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      id: 3,
      type: "photo",
      park: "Granville Park",
      action: "shared photo at",
      time: "3 days ago",
      icon: Camera,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      id: 4,
      type: "like",
      park: "Merrylands Park",
      action: "liked review of",
      time: "5 days ago",
      icon: ThumbsUp,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      id: 5,
      type: "friend",
      park: "",
      action: "connected with Sarah M.",
      time: "1 week ago",
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
  ])

  const [achievements, setAchievements] = useState([
    { name: "Park Explorer", description: "Visited 10+ parks", icon: "🏆", unlocked: true },
    { name: "Review Master", description: "Written 5+ reviews", icon: "⭐", unlocked: true },
    { name: "Photo Enthusiast", description: "Shared 20+ photos", icon: "📸", unlocked: true },
    { name: "Social Butterfly", description: "Connected with 10+ dog owners", icon: "🦋", unlocked: true },
    { name: "Distance Walker", description: "Walked 50km total", icon: "🚶", unlocked: false },
    { name: "Weather Warrior", description: "Visited parks in all weather", icon: "⛈️", unlocked: false },
  ])

  useEffect(() => {
    try {
      let user = null

      // Handle demo mode
      if (isDemoMode) {
        user = createDemoUser()
        console.log("Demo user created:", user)
      } else {
        // Get existing user data
        user = getUserData()
        console.log("User data retrieved:", user)
      }

      if (!user) {
        setError("No user data found. Please sign up or try demo mode.")
        setLoading(false)
        return
      }

      setUserData(user)
      setLoading(false)
    } catch (err) {
      console.error("Error loading user data:", err)
      setError("Failed to load user data")
      setLoading(false)
    }
  }, [isDemoMode])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{error}</p>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
                <Link href="/dashboard?demo=true">Try Demo</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Welcome to Tail Trails</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Please sign up or try our demo to get started.</p>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
                <Link href="/dashboard?demo=true">Try Demo</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const firstName = userData.firstName || "Friend"
  const fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim()

  // Get random parks for recommendations
  const recommendedParks = [...sydneyDogParks].sort(() => 0.5 - Math.random()).slice(0, 3)
  const nearbyParks = [...sydneyDogParks].sort(() => 0.5 - Math.random()).slice(0, 2)

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      {/* Demo Mode Indicator */}
      {userData.isDemo && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertTitle className="text-amber-800 flex items-center gap-2">
            <PawPrint className="h-4 w-4" /> Demo Mode
          </AlertTitle>
          <AlertDescription className="text-amber-700">
            You're currently viewing the dashboard in demo mode.{" "}
            <Link href="/signup" className="underline font-medium">
              Create an account
            </Link>{" "}
            for the full experience.
          </AlertDescription>
        </Alert>
      )}

      {/* Welcome Message */}
      {isWelcome && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertTitle className="text-green-800 flex items-center gap-2">
            <PawPrint className="h-4 w-4" /> Welcome to Tail Trails, {firstName}!
          </AlertTitle>
          <AlertDescription className="text-green-700">
            {isNewUser
              ? "Your account has been created successfully! Explore Sydney's best dog parks and connect with other dog lovers."
              : "Welcome back! Ready to discover some amazing dog parks?"}
          </AlertDescription>
        </Alert>
      )}

      {/* User Welcome Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-green-100">
            <AvatarImage src="/placeholder.svg?height=64&width=64" />
            <AvatarFallback className="bg-green-100 text-green-800 text-lg">
              {firstName.charAt(0)}
              {userData.lastName?.charAt(0) || ""}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">G'day, {firstName}!</h1>
            <p className="text-gray-600">Ready to explore dog parks today?</p>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span>Level 3 Explorer</span>
              <span>•</span>
              <span>{stats.parksVisited} parks visited</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="gap-2">
            <Link href={`/map${userData.isDemo ? "?demo=true" : ""}`}>
              <MapPin className="h-4 w-4" />
              Find Parks
            </Link>
          </Button>
          <Button asChild className="gap-2 bg-green-600 hover:bg-green-700">
            <Link href={`/plan-visit${userData.isDemo ? "?demo=true" : ""}`}>
              <Calendar className="h-4 w-4" />
              Plan a Visit
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Quick Actions</SheetTitle>
                <SheetDescription>What would you like to do?</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <Button className="w-full justify-start gap-2">
                  <Camera className="h-4 w-4" />
                  Share a Photo
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Star className="h-4 w-4" />
                  Write a Review
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Users className="h-4 w-4" />
                  Find Dog Friends
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <MapPin className="h-4 w-4" />
                  Add New Park
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/settings${userData.isDemo ? "?demo=true" : ""}`}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.parksVisited}</div>
            <div className="text-sm text-gray-600">Parks Visited</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.reviewsWritten}</div>
            <div className="text-sm text-gray-600">Reviews</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.photosShared}</div>
            <div className="text-sm text-gray-600">Photos</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600">{stats.friendsConnected}</div>
            <div className="text-sm text-gray-600">Friends</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.totalDistance}km</div>
            <div className="text-sm text-gray-600">Distance</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.favoriteParks}</div>
            <div className="text-sm text-gray-600">Favourites</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="recommended" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="nearby">Nearby</TabsTrigger>
              <TabsTrigger value="favorites">Favourites</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>

            <TabsContent value="recommended" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Recommended for You</h3>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedParks.map((park) => (
                  <Card key={park.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={park.image || "/placeholder.svg?height=160&width=320&query=dog+park"}
                        alt={park.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Heart className="h-4 w-4 mr-2" />
                              Add to Favourites
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share Park
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="h-4 w-4 mr-2" />
                              Plan Visit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{park.name}</CardTitle>
                        <Badge variant="outline" className="bg-green-50">
                          {park.size}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {park.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{park.rating}/5</span>
                          <span className="text-gray-400">({park.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{Math.floor(Math.random() * 20) + 5} today</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link href={`/parks/${park.slug}${userData.isDemo ? "?demo=true" : ""}`}>Details</Link>
                        </Button>
                        <Button asChild size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                          <Link href={`/plan-visit?park=${park.slug}${userData.isDemo ? "&demo=true" : ""}`}>
                            Plan Visit
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                View More Recommendations
              </Button>
            </TabsContent>

            <TabsContent value="nearby" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Parks Near You</h3>
                <Badge variant="secondary">Within 10km</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyParks.map((park) => (
                  <Card key={park.id} className="overflow-hidden">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={park.image || "/placeholder.svg?height=160&width=320&query=dog+park"}
                        alt={park.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{park.name}</CardTitle>
                        <Badge variant="outline" className="bg-blue-50">
                          {Math.floor(Math.random() * 5) + 1}km
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {park.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{park.rating}/5</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{Math.floor(Math.random() * 10) + 5} min</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link href={`/parks/${park.slug}${userData.isDemo ? "?demo=true" : ""}`}>Details</Link>
                        </Button>
                        <Button asChild size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                          <Link href={`/plan-visit?park=${park.slug}${userData.isDemo ? "&demo=true" : ""}`}>
                            Plan Visit
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Favourites</CardTitle>
                  <CardDescription>Parks you've saved as favourites will appear here.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">You haven't saved any favourites yet</p>
                  <Button asChild variant="outline">
                    <Link href={`/parks${userData.isDemo ? "?demo=true" : ""}`}>
                      <Search className="h-4 w-4 mr-2" />
                      Explore Parks
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trending" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Trending This Week</h3>
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Hot
                </Badge>
              </div>
              <div className="space-y-4">
                {recommendedParks.slice(0, 3).map((park, index) => (
                  <Card key={park.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-green-600">#{index + 1}</div>
                      <img
                        src={park.image || "/placeholder.svg"}
                        alt={park.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{park.name}</h4>
                        <p className="text-sm text-gray-600">{park.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{park.rating}/5</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-600">
                            {Math.floor(Math.random() * 50) + 20} visits this week
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent interactions and visits</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                  <div className={`${activity.bg} p-2 rounded-full`}>
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      You {activity.action} {activity.park}
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Community Feed */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Community Feed</CardTitle>
                  <CardDescription>See what other dog owners are up to</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/community${userData.isDemo ? "?demo=true" : ""}`}>
                    <Users className="h-4 w-4 mr-2" />
                    View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Sarah M.</span>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                  <p className="text-sm mb-2">
                    Just had an amazing time at Parramatta Park with Luna! The off-leash area was perfect for her to run
                    around. 🐕
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <button className="flex items-center gap-1 hover:text-green-600">
                      <ThumbsUp className="h-4 w-4" />
                      12
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-600">
                      <MessageSquare className="h-4 w-4" />3
                    </button>
                    <button className="flex items-center gap-1 hover:text-purple-600">
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">James D.</span>
                    <span className="text-sm text-gray-500">5 hours ago</span>
                  </div>
                  <p className="text-sm mb-2">
                    Looking for dog walking buddies in the Granville area. Max loves playing with other dogs! 🎾
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <button className="flex items-center gap-1 hover:text-green-600">
                      <ThumbsUp className="h-4 w-4" />8
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-600">
                      <MessageSquare className="h-4 w-4" />5
                    </button>
                    <button className="flex items-center gap-1 hover:text-purple-600">
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Maps & Navigation */}
          <Card className="bg-gradient-to-br from-blue-50 to-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-blue-600" />
                Maps & Navigation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start gap-2" variant="outline">
                <Link href={`/map${userData.isDemo ? "?demo=true" : ""}`}>
                  <Compass className="h-4 w-4" />
                  Interactive Map
                </Link>
              </Button>
              <Button asChild className="w-full justify-start gap-2" variant="outline">
                <Link href={`/map${userData.isDemo ? "?demo=true" : ""}`}>
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </Link>
              </Button>
              <Button asChild className="w-full justify-start gap-2" variant="outline">
                <Link href={`/map${userData.isDemo ? "?demo=true" : ""}`}>
                  <Route className="h-4 w-4" />
                  Plan Route
                </Link>
              </Button>
              <div className="p-3 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Quick Tip:</strong> Use our interactive map to find the best route to any park with real-time
                  traffic updates.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Community Hub */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Community Hub
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start gap-2" variant="outline">
                <Link href={`/community${userData.isDemo ? "?demo=true" : ""}`}>
                  <MessageSquare className="h-4 w-4" />
                  Community Feed
                </Link>
              </Button>
              <Button asChild className="w-full justify-start gap-2" variant="outline">
                <Link href={`/community${userData.isDemo ? "?demo=true" : ""}`}>
                  <UserPlus className="h-4 w-4" />
                  Find Dog Friends
                </Link>
              </Button>
              <Button asChild className="w-full justify-start gap-2" variant="outline">
                <Link href={`/community${userData.isDemo ? "?demo=true" : ""}`}>
                  <CalendarIcon className="h-4 w-4" />
                  Events & Meetups
                </Link>
              </Button>
              <Button asChild className="w-full justify-start gap-2" variant="outline">
                <Link href={`/community${userData.isDemo ? "?demo=true" : ""}`}>
                  <ImageIcon className="h-4 w-4" />
                  Photo Gallery
                </Link>
              </Button>
              <div className="p-3 bg-purple-100 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Active Now:</strong> {stats.friendsConnected} friends online, 3 events this week
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Weather Widget */}
          <Card className="bg-gradient-to-br from-blue-50 to-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-yellow-500" />
                Today's Weather
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{weatherData.temperature}°C</div>
                  <div className="text-gray-600">{weatherData.condition}</div>
                </div>
                <div className="text-4xl">{weatherData.icon}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-blue-500" />
                  <span>{weatherData.humidity}% humidity</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-gray-500" />
                  <span>{weatherData.windSpeed} km/h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-orange-500" />
                  <span>UV {weatherData.uvIndex}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudRain className="h-4 w-4 text-blue-600" />
                  <span>{weatherData.precipitation}mm rain</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span>🌅 {weatherData.sunrise}</span>
                <span>🌇 {weatherData.sunset}</span>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Dog Weather Tip:</strong> Perfect conditions for a park visit! Bring water and enjoy the
                  outdoors.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-lg ${achievement.unlocked ? "bg-green-50" : "bg-gray-50"}`}
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className={`font-medium ${achievement.unlocked ? "text-green-800" : "text-gray-500"}`}>
                      {achievement.name}
                    </div>
                    <div className={`text-sm ${achievement.unlocked ? "text-green-600" : "text-gray-400"}`}>
                      {achievement.description}
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ✓
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Bookmark className="h-4 w-4" />
                Saved Parks ({stats.favoriteParks})
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                Find Dog Mates
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Heart className="h-4 w-4" />
                My Reviews ({stats.reviewsWritten})
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Camera className="h-4 w-4" />
                Photo Gallery ({stats.photosShared})
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Target className="h-4 w-4" />
                Set Goals
              </Button>
            </CardContent>
          </Card>

          {/* Profile Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Profile Progress</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Profile photo added</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Bio completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>First park visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Add dog information</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Connect social accounts</span>
                </div>
              </div>
              <Button size="sm" className="w-full">
                Complete Profile
              </Button>
            </CardContent>
          </Card>

          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" />
                  <AvatarFallback className="bg-green-100 text-green-800">
                    {firstName.charAt(0)}
                    {userData.lastName?.charAt(0) || ""}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{fullName}</p>
                  <p className="text-sm text-gray-500">@{userData.username || "dogmate"}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {userData.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Member since:</span>{" "}
                  {new Date(userData.createdAt || Date.now()).toLocaleDateString("en-AU")}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Bio:</span> Dog lover and park explorer
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/settings${userData.isDemo ? "?demo=true" : ""}`}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
