"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Navigation, ArrowLeft, Search, Filter } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { MapClient } from "@/components/map-client"

interface MapPageClientProps {
  weatherDescription: string
  weatherIcon: string
}

export function MapPageClient({ weatherDescription, weatherIcon }: MapPageClientProps) {
  const [selectedPark, setSelectedPark] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"

  // Mock park data for the selected park
  const mockSelectedPark = {
    id: 1,
    name: "Parramatta Park",
    location: "Parramatta, NSW",
    rating: 4.8,
    reviews: 1247,
    image: "/placeholder.svg?height=200&width=300",
    weather: weatherDescription,
    weatherIcon: weatherIcon,
    latitude: -33.8124,
    longitude: 151.0051,
    facilities: ["Off-leash area", "Water fountains", "Parking", "Toilets", "Cafe nearby"],
    description:
      "Historic 85-hectare park with dedicated off-leash areas and beautiful walking trails along the Parramatta River. Perfect for dogs of all sizes with plenty of space to run and play.",
    distance: "2.3 km",
    address: "Pitt St & Macquarie St, Parramatta NSW 2150",
    hours: "6:00 AM - 8:00 PM",
    phone: "(02) 9895 7500",
  }

  const nearbyParks = [
    { name: "Parramatta Park", distance: "2.3 km", rating: 4.8, lat: -33.8124, lng: 151.0051 },
    { name: "Lake Parramatta Reserve", distance: "3.5 km", rating: 4.7, lat: -33.7989, lng: 151.0159 },
    { name: "Granville Park", distance: "4.2 km", rating: 4.5, lat: -33.8346, lng: 151.0133 },
    { name: "Merrylands Park", distance: "5.1 km", rating: 4.6, lat: -33.8372, lng: 150.9867 },
    { name: "Westmead Park", distance: "2.8 km", rating: 4.4, lat: -33.8072, lng: 150.9893 },
  ]

  const filteredParks = nearbyParks.filter((park) => park.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={isDemo ? "/dashboard?demo=true" : "/"}
                className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {isDemo ? "Dashboard" : "Home"}
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Interactive Map</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search parks..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Map Container */}
        <div className="flex-1 relative">
          {selectedPark ? (
            <div className="w-full h-full">
              <MapClient
                latitude={selectedPark.latitude}
                longitude={selectedPark.longitude}
                parkName={selectedPark.name}
                address={selectedPark.address}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 relative">
              {/* Interactive Map Overview */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Parramatta Area Dog Parks</h3>
                  <p className="text-gray-600 mb-6">Click on a park pin or select from the sidebar to view details</p>

                  {/* Interactive Park Pins */}
                  <div className="relative w-96 h-64 mx-auto bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                    {nearbyParks.map((park, index) => (
                      <div
                        key={index}
                        className="absolute bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-all duration-200 hover:scale-110 flex items-center justify-center shadow-lg"
                        style={{
                          left: `${20 + (index % 3) * 30}%`,
                          top: `${20 + Math.floor(index / 3) * 40}%`,
                        }}
                        onClick={() =>
                          setSelectedPark({
                            ...mockSelectedPark,
                            name: park.name,
                            latitude: park.lat,
                            longitude: park.lng,
                            rating: park.rating,
                            distance: park.distance,
                          })
                        }
                        title={park.name}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-gray-500 mt-4">{nearbyParks.length} dog parks in the Parramatta area</p>
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 space-y-2">
                <Button size="sm" variant="secondary" className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm">
                  +
                </Button>
                <Button size="sm" variant="secondary" className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm">
                  -
                </Button>
              </div>

              {/* Current Location Button */}
              <div className="absolute bottom-4 right-4">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 shadow-lg">
                  <Navigation className="w-4 h-4 mr-2" />
                  My Location
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-white border-l overflow-y-auto">
          {selectedPark ? (
            <div className="p-6">
              <div className="mb-4">
                <Button variant="ghost" size="sm" onClick={() => setSelectedPark(null)} className="mb-4">
                  ← Back to search
                </Button>
              </div>

              <Card className="shadow-lg">
                <div className="relative">
                  <img
                    src={selectedPark.image || "/placeholder.svg"}
                    alt={selectedPark.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-sm font-medium">
                    {selectedPark.distance}
                  </div>
                  <div className="absolute top-4 left-4 bg-green-600/90 backdrop-blur-sm rounded-lg px-2 py-1 text-sm font-medium text-white">
                    {selectedPark.weatherIcon} {selectedPark.weather}
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl">{selectedPark.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedPark.location}
                  </CardDescription>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedPark.rating}</span>
                      <span className="text-gray-500">({selectedPark.reviews} reviews)</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <strong>Hours:</strong> {selectedPark.hours}
                  </div>

                  <div className="text-sm text-gray-600">
                    <strong>Address:</strong> {selectedPark.address}
                  </div>

                  <p className="text-sm text-gray-700">{selectedPark.description}</p>

                  <div>
                    <h4 className="font-medium mb-2">Facilities</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedPark.facilities.map((facility: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${selectedPark.latitude},${selectedPark.longitude}`,
                          "_blank",
                        )
                      }
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`tel:${selectedPark.phone}`, "_blank")}
                      >
                        Call Park
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: selectedPark.name,
                              text: `Check out ${selectedPark.name} - ${selectedPark.description.substring(0, 100)}...`,
                              url: window.location.href,
                            })
                          } else {
                            navigator.clipboard.writeText(window.location.href)
                            alert("Link copied to clipboard!")
                          }
                        }}
                      >
                        Share Location
                      </Button>
                    </div>
                    <Link
                      href={`/parks/${selectedPark.name.toLowerCase().replace(/\s+/g, "-")}${isDemo ? "?demo=true" : ""}`}
                    >
                      <Button variant="outline" className="w-full" size="sm">
                        View Full Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Nearby Parks</h3>
              <div className="space-y-4">
                {filteredParks.map((park, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                    onClick={() =>
                      setSelectedPark({
                        ...mockSelectedPark,
                        name: park.name,
                        latitude: park.lat,
                        longitude: park.lng,
                        rating: park.rating,
                        distance: park.distance,
                      })
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{park.name}</h4>
                          <p className="text-sm text-gray-500">{park.distance} away</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {park.rating}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredParks.length === 0 && searchQuery && (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No parks found matching "{searchQuery}"</p>
                </div>
              )}

              <div className="mt-6">
                <Link href={`/parks${isDemo ? "?demo=true" : ""}`}>
                  <Button variant="outline" className="w-full">
                    View All Parks
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
