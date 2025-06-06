"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Star,
  ArrowLeft,
  Clock,
  Phone,
  Globe,
  Navigation,
  Camera,
  Users,
  TreePine,
  Droplets,
  Car,
  Utensils,
} from "lucide-react"
import type { Park } from "@/lib/parks-data"
import { getWeatherData, getWeatherDescription, getWeatherIcon } from "@/lib/weather"

interface ParkPageClientProps {
  params: { slug: string }
  searchParams: { demo?: string }
  park: Park
}

export function ParkPageClient({ params, searchParams, park }: ParkPageClientProps) {
  const [weatherData, setWeatherData] = useState<{ description: string; icon: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Use useSearchParams hook for client-side search params
  const clientSearchParams = useSearchParams()
  const isDemo = searchParams.demo === "true" || clientSearchParams?.get("demo") === "true"

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const data = await getWeatherData(park.coordinates.latitude, park.coordinates.longitude)
        if (data) {
          setWeatherData({
            description: getWeatherDescription(data),
            icon: getWeatherIcon(data),
          })
        }
      } catch (error) {
        console.error("Error loading weather:", error)
        setWeatherData({
          description: "Weather unavailable",
          icon: "🌤️",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadWeather()
  }, [park.coordinates])

  const facilityIcons: Record<string, any> = {
    "Off-leash area": TreePine,
    "Fully fenced": Users,
    "Water fountains": Droplets,
    "Dog water station": Droplets,
    "Seating areas": Users,
    "Shaded areas": TreePine,
    Parking: Car,
    Toilets: Users,
    "Cafe nearby": Utensils,
    Playground: Users,
    "Agility equipment": Users,
    "Waste bags": Users,
    "Picnic areas": Utensils,
    "BBQ facilities": Utensils,
    "Beach access": Droplets,
    "Swimming area": Droplets,
    "Walking trails": TreePine,
    "Night lighting": Users,
    "Small dog area": Users,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href={isDemo ? "/parks?demo=true" : "/parks"}
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Parks
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{park.name}</h1>
              <p className="text-gray-600 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {park.location}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-lg">{park.rating}</span>
                <span className="text-gray-500">({park.reviews} reviews)</span>
              </div>
              <Badge variant="secondary" className="text-sm">
                {park.distance}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={park.image || "/placeholder.svg"}
                  alt={park.name}
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 text-sm">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                        <span>Loading weather...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">{weatherData?.icon || "🌤️"}</span>
                        <span className="font-medium">{weatherData?.description || "Weather unavailable"}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Park</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">{park.description}</p>
                {park.longDescription && <p className="text-gray-600 leading-relaxed">{park.longDescription}</p>}
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card>
              <CardHeader>
                <CardTitle>Facilities & Features</CardTitle>
                <CardDescription>What this park offers for you and your dog</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {park.facilities.map((facility, index) => {
                    const IconComponent = facilityIcons[facility.name] || TreePine
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <IconComponent className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-800">{facility.name}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Rules & Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Rules & Guidelines</CardTitle>
                <CardDescription>Important information for your visit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Off-Leash Areas</h4>
                    <p className="text-sm text-green-700">
                      {park.rules.offLeashAreas ? "✅ Available" : "❌ Not available"}
                    </p>
                    {park.rules.offLeashHours && (
                      <p className="text-xs text-green-600 mt-1">{park.rules.offLeashHours}</p>
                    )}
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Water Access</h4>
                    <p className="text-sm text-blue-700">
                      {park.rules.dogWaterAccess ? "✅ Available" : "❌ Not available"}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Waste Management</h4>
                  <p className="text-sm text-gray-700">
                    {park.rules.bagDispenserAvailable
                      ? "✅ Waste bags provided on-site"
                      : "⚠️ Please bring your own waste bags"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Hours</div>
                    <div className="text-sm text-gray-600">{park.hours}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Address</div>
                    <div className="text-sm text-gray-600">{park.address}</div>
                  </div>
                </div>
                {park.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Phone</div>
                      <div className="text-sm text-gray-600">{park.phone}</div>
                    </div>
                  </div>
                )}
                {park.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Website</div>
                      <a
                        href={park.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
                <Button variant="outline" className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  View Photos
                </Button>
                <Link href={`/plan-visit?park=${park.id}${isDemo ? "&demo=true" : ""}`}>
                  <Button variant="outline" className="w-full">
                    <Clock className="w-4 h-4 mr-2" />
                    Plan Visit
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Park Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Park Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Size</span>
                  <span className="text-sm font-medium">{park.size}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Distance</span>
                  <span className="text-sm font-medium">{park.distance}</span>
                </div>
                <Separator />
                <div>
                  <span className="text-sm text-gray-600">Terrain</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {park.terrain.map((terrain, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {terrain}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
