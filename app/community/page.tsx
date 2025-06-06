"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users, MessageCircle, Calendar, Award, Heart, Share2, MapPin, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CommunityPage() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"

  const communityStats = [
    { label: "Active Members", value: "2,847", icon: Users },
    { label: "Posts This Week", value: "156", icon: MessageCircle },
    { label: "Upcoming Events", value: "8", icon: Calendar },
    { label: "Top Contributors", value: "24", icon: Award },
  ]

  const recentPosts = [
    {
      id: 1,
      author: "Sarah M.",
      avatar: "/placeholder.svg?height=40&width=40",
      time: "2 hours ago",
      content:
        "Just discovered the most amazing off-leash area at Centennial Park! My golden retriever Max had the time of his life. The new agility equipment is fantastic! 🐕",
      likes: 23,
      comments: 8,
      location: "Centennial Park",
      images: ["/placeholder.svg?height=200&width=300"],
    },
    {
      id: 2,
      author: "Mike T.",
      avatar: "/placeholder.svg?height=40&width=40",
      time: "4 hours ago",
      content:
        "Looking for other border collie owners in the Inner West! Luna loves to play fetch and would love some playmates. Anyone interested in a weekend meetup?",
      likes: 15,
      comments: 12,
      location: "Inner West Sydney",
    },
    {
      id: 3,
      author: "Emma K.",
      avatar: "/placeholder.svg?height=40&width=40",
      time: "6 hours ago",
      content:
        "PSA: The water fountains at Rushcutters Bay Park have been fixed! Perfect timing with this warm weather. Remember to bring a bowl for your furry mates! 💧",
      likes: 31,
      comments: 5,
      location: "Rushcutters Bay Park",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Puppy Socialisation Class",
      date: "Saturday, 15 Dec",
      time: "10:00 AM",
      location: "Bicentennial Park",
      attendees: 12,
      maxAttendees: 15,
    },
    {
      id: 2,
      title: "Dog Photography Workshop",
      date: "Sunday, 16 Dec",
      time: "2:00 PM",
      location: "Royal Botanic Gardens",
      attendees: 8,
      maxAttendees: 10,
    },
    {
      id: 3,
      title: "Large Breed Playdate",
      date: "Wednesday, 19 Dec",
      time: "5:30 PM",
      location: "Centennial Park",
      attendees: 18,
      maxAttendees: 25,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={isDemo ? "/dashboard?demo=true" : "/dashboard"}
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        {isDemo && (
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              🎭 <strong>Demo Mode:</strong> This is a preview of the community features. Join our community to connect
              with real dog owners!
            </p>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tail Trails Community</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Connect with fellow dog owners across Sydney. Share experiences, organise playdates, and discover the best
            spots for your furry mates!
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {communityStats.map((stat, index) => (
            <Card key={index} className="text-centre">
              <CardContent className="p-4">
                <div className="flex items-centre justify-centre mb-2">
                  <stat.icon className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Recent Community Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {recentPosts.map((post) => (
                  <div key={post.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.author} />
                        <AvatarFallback>
                          {post.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-centre gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{post.author}</span>
                          <span className="text-sm text-gray-500">{post.time}</span>
                          {post.location && (
                            <Badge variant="secondary" className="text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              {post.location}
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-700 mb-3">{post.content}</p>
                        {post.images && (
                          <div className="mb-3">
                            <img
                              src={post.images[0] || "/placeholder.svg"}
                              alt="Post image"
                              className="rounded-lg max-w-full h-48 object-cover"
                            />
                          </div>
                        )}
                        <div className="flex items-centre gap-4 text-sm text-gray-500">
                          <button className="flex items-centre gap-1 hover:text-red-500 transition-colours">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </button>
                          <button className="flex items-centre gap-1 hover:text-blue-500 transition-colours">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments}
                          </button>
                          <button className="flex items-centre gap-1 hover:text-green-500 transition-colours">
                            <Share2 className="w-4 h-4" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="w-full" variant="outline">
                  Load More Posts
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div>
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-centre gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                      <div className="flex items-centre gap-1">
                        <Users className="w-3 h-3" />
                        {event.attendees}/{event.maxAttendees} attending
                      </div>
                    </div>
                    <Button size="sm" className="w-full">
                      Join Event
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Events
                </Button>
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-centre gap-2">
                  <Award className="w-5 h-5" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Jessica L.", posts: 47, avatar: "/placeholder.svg?height=32&width=32" },
                    { name: "David R.", posts: 39, avatar: "/placeholder.svg?height=32&width=32" },
                    { name: "Amy C.", posts: 31, avatar: "/placeholder.svg?height=32&width=32" },
                  ].map((contributor, index) => (
                    <div key={index} className="flex items-centre gap-3">
                      <div className="flex items-centre justify-centre w-6 h-6 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                        {index + 1}
                      </div>
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={contributor.avatar || "/placeholder.svg"} alt={contributor.name} />
                        <AvatarFallback>
                          {contributor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{contributor.name}</div>
                        <div className="text-xs text-gray-500">{contributor.posts} posts</div>
                      </div>
                      <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  Create New Post
                </Button>
                <Button className="w-full" variant="outline">
                  Organise Meetup
                </Button>
                <Button className="w-full" variant="outline">
                  Find Playmates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
