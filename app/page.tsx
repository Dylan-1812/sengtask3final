import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users, Star, Camera, Shield, Navigation } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">TT</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Tail Trails</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/parks" className="text-gray-700 hover:text-green-600 transition-colours">
                Parks
              </Link>
              <Link href="/map" className="text-gray-700 hover:text-green-600 transition-colours">
                Map
              </Link>
              <Link href="/community" className="text-gray-700 hover:text-green-600 transition-colours">
                Community
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Discover Sydney's Best <span className="text-green-600">Dog Parks</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Find the perfect park for you and your furry mate. Explore 250+ local parks with real reviews, live weather
            updates, and a vibrant community of dog lovers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/parks">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8">
                Explore Parks
              </Button>
            </Link>
            <Link href="/map">
              <Button size="lg" variant="outline" className="px-8">
                View Map
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need for the Perfect Dog Park Visit
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>250+ Local Parks</CardTitle>
                <CardDescription>
                  Comprehensive directory of dog-friendly parks across Sydney with detailed information
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Navigation className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Interactive Maps</CardTitle>
                <CardDescription>Get directions, travel options, and real-time navigation to any park</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle>Reviews & Ratings</CardTitle>
                <CardDescription>
                  Read authentic reviews from fellow dog owners and share your experiences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Camera className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Dog Community</CardTitle>
                <CardDescription>Share photos of your furry mates and connect with other dog lovers</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Secure Platform</CardTitle>
                <CardDescription>Safe and secure user authentication with CAPTCHA protection</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <CardTitle>Live Updates</CardTitle>
                <CardDescription>Real-time weather updates and current park conditions</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join the Tail Trails Community Today</h2>
          <p className="text-xl text-green-100 mb-8">
            Connect with fellow dog owners, discover new parks, and make every walk an adventure.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="px-8">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TT</span>
                </div>
                <span className="text-xl font-bold">Tail Trails</span>
              </div>
              <p className="text-gray-400">
                Sydney's premier platform for discovering dog-friendly parks and connecting with fellow dog lovers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Explore</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/parks" className="hover:text-white transition-colours">
                    Parks Directory
                  </Link>
                </li>
                <li>
                  <Link href="/map" className="hover:text-white transition-colours">
                    Interactive Map
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white transition-colours">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/login" className="hover:text-white transition-colours">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white transition-colours">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-white transition-colours">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colours">
                    Help Centre
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colours">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colours">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Tail Trails. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
