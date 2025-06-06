"use client"

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Suspense, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  MapPin,
  Star,
  Navigation,
  Phone,
  Globe,
  Droplet,
  Sun,
  Car,
  Coffee,
  TreePine,
  Waves,
  Mountain,
  Users,
  AlertTriangle,
  CheckCircle,
  Shield,
  Activity,
  PawPrint,
  Map,
  Thermometer,
  Cloud,
  ChevronLeft,
  ChevronRight,
  Maximize,
  X,
} from "lucide-react"
import { sydneyDogParks } from "@/lib/parks-data"
import {
  getWeatherData,
  getWeatherDescription,
  getWeatherIcon,
  formatSunTime,
  formatDuration,
  getUVDescription,
  getDogWeatherAdvice,
} from "@/lib/weather"
import { GoogleMap } from "@/components/google-map"

interface PageProps {
  params: { slug: string }
  searchParams: { demo?: string }
}

// Park images mapping
const parkImagesMap: Record<string, Array<{ url: string; alt: string; caption: string }>> = {
  "parramatta-park": [
    {
      url: "/images/parks/parramatta-park-main.png",
      alt: "Parramatta Park - Main view",
      caption: "Historic park with heritage buildings and open grass areas",
    },
    {
      url: "/images/parks/parramatta-park-dogs.png",
      alt: "Parramatta Park - Dogs playing",
      caption: "Dogs enjoying off-leash time in the Domain Creek area",
    },
    {
      url: "/images/parks/parramatta-park-river.png",
      alt: "Parramatta Park - River trail",
      caption: "Scenic Parramatta River walking trail",
    },
    {
      url: "/images/parks/parramatta-park-heritage.png",
      alt: "Parramatta Park - Heritage buildings",
      caption: "Historic buildings and landscaped gardens",
    },
    {
      url: "/images/parks/parramatta-park-aerial.png",
      alt: "Parramatta Park - Aerial view",
      caption: "Aerial view of the entire 85-hectare park",
    },
  ],
  "lake-parramatta-reserve": [
    {
      url: "/images/parks/lake-parramatta-main.png",
      alt: "Lake Parramatta Reserve - Main view",
      caption: "Beautiful lake surrounded by native bushland",
    },
    {
      url: "/images/parks/lake-parramatta-dogs.png",
      alt: "Lake Parramatta Reserve - Dogs swimming",
      caption: "Dogs enjoying water access during off-leash hours",
    },
    {
      url: "/images/parks/lake-parramatta-trail.png",
      alt: "Lake Parramatta Reserve - Bushland trail",
      caption: "Native bushland walking trails of varying difficulty",
    },
    {
      url: "/images/parks/lake-parramatta-picnic.png",
      alt: "Lake Parramatta Reserve - Picnic area",
      caption: "Family-friendly picnic areas with BBQ facilities",
    },
    {
      url: "/images/parks/lake-parramatta-aerial.png",
      alt: "Lake Parramatta Reserve - Aerial view",
      caption: "70 hectares of pristine bushland and lake",
    },
  ],
  "granville-park": [
    {
      url: "/images/parks/granville-park-main.png",
      alt: "Granville Park - Main fenced area",
      caption: "Fully fenced dog park with separate areas for different sized dogs",
    },
    {
      url: "/images/parks/granville-park-agility.png",
      alt: "Granville Park - Agility equipment",
      caption: "Dog agility equipment for active pets",
    },
    {
      url: "/images/parks/granville-park-small-dogs.png",
      alt: "Granville Park - Small dog area",
      caption: "Dedicated safe space for small and nervous dogs",
    },
    {
      url: "/images/parks/granville-park-facilities.png",
      alt: "Granville Park - Facilities",
      caption: "Water stations, seating and waste bag dispensers",
    },
    {
      url: "/images/parks/granville-park-entrance.png",
      alt: "Granville Park - Entrance",
      caption: "Convenient location near Granville train station",
    },
  ],
  "merrylands-park": [
    {
      url: "/images/parks/merrylands-park-main.png",
      alt: "Merrylands Park - Main area",
      caption: "Large community park with extensive off-leash areas",
    },
    {
      url: "/images/parks/merrylands-park-playground.png",
      alt: "Merrylands Park - Playground",
      caption: "Family-friendly with playground and dog areas combined",
    },
    {
      url: "/images/parks/merrylands-park-paths.png",
      alt: "Merrylands Park - Walking paths",
      caption: "Multiple walking paths with mature shade trees",
    },
    {
      url: "/images/parks/merrylands-park-community.png",
      alt: "Merrylands Park - Community events",
      caption: "Popular venue for local dog owner meetups",
    },
    {
      url: "/images/parks/merrylands-park-facilities.png",
      alt: "Merrylands Park - Facilities",
      caption: "Excellent amenities including picnic and BBQ areas",
    },
  ],
  "westmead-park": [
    {
      url: "/images/parks/westmead-park-main.png",
      alt: "Westmead Park - Evening scene",
      caption: "Well-lit park perfect for evening dog walks",
    },
    {
      url: "/images/parks/westmead-park-medical.png",
      alt: "Westmead Park - Medical precinct",
      caption: "Convenient location near Westmead Hospital",
    },
    {
      url: "/images/parks/westmead-park-gardens.png",
      alt: "Westmead Park - Landscaped gardens",
      caption: "Beautiful landscaped gardens with paved walkways",
    },
    {
      url: "/images/parks/westmead-park-evening.png",
      alt: "Westmead Park - Evening lighting",
      caption: "Excellent lighting system for safe evening exercise",
    },
    {
      url: "/images/parks/westmead-park-paths.png",
      alt: "Westmead Park - Lit walkways",
      caption: "Connected walkways to broader Westmead area",
    },
  ],
}

export function ParkPageClient({ params, searchParams }: PageProps) {
  const park = sydneyDogParks.find((p) => p.slug === params.slug)
  const isDemo = searchParams.demo === "true"
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  if (!park) {
    notFound()
  }

  // Get park images
  const parkImages = parkImagesMap[park.slug] || [
    {
      url: `/placeholder.svg?height=800&width=1200&text=${encodeURIComponent(park.name + " - Main View")}`,
      alt: `${park.name} - Main view`,
      caption: "Main park area with off-leash zone",
    },
    {
      url: `/placeholder.svg?height=800&width=1200&text=${encodeURIComponent(park.name + " - Dog Play Area")}`,
      alt: `${park.name} - Dog play area`,
      caption: "Dedicated dog play area with agility equipment",
    },
    {
      url: `/placeholder.svg?height=800&width=1200&text=${encodeURIComponent(park.name + " - Walking Trail")}`,
      alt: `${park.name} - Walking trail`,
      caption: "Scenic walking trail through the park",
    },
    {
      url: `/placeholder.svg?height=800&width=1200&text=${encodeURIComponent(park.name + " - Water Feature")}`,
      alt: `${park.name} - Water feature`,
      caption: "Water feature where dogs can cool off",
    },
    {
      url: `/placeholder.svg?height=800&width=1200&text=${encodeURIComponent(park.name + " - Aerial View")}`,
      alt: `${park.name} - Aerial view`,
      caption: "Aerial view of the entire park",
    },
  ]

  // Fetch weather data for this specific park
  const getWeatherDataAsync = async () => {
    return await getWeatherData(park.coordinates.latitude, park.coordinates.longitude)
  }

  const weatherPromise = getWeatherDataAsync()

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === parkImages.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? parkImages.length - 1 : prev - 1))
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setShowLightbox(true)
  }

  const closeLightbox = () => {
    setShowLightbox(false)
  }

  const WeatherComponent = async () => {
    const weatherData = await weatherPromise
    const weatherDescription = weatherData ? getWeatherDescription(weatherData) : "Weather unavailable"
    const weatherIcon = weatherData ? getWeatherIcon(weatherData) : "🌤️"

    // Get UV index and advice
    const uvIndex = weatherData?.daily.uv_index_max[0] || 0
    const uvInfo = getUVDescription(uvIndex)

    // Get dog-specific weather advice
    const dogAdvice = weatherData ? getDogWeatherAdvice(weatherData) : ""

    // Format sunrise/sunset times
    const sunrise = weatherData ? formatSunTime(weatherData.daily.sunrise[0]) : "N/A"
    const sunset = weatherData ? formatSunTime(weatherData.daily.sunset[0]) : "N/A"

    // Format daylight duration
    const daylightDuration = weatherData ? formatDuration(weatherData.daily.daylight_duration[0]) : "N/A"

    // Get current weather values
    const currentTemp = weatherData?.current.temperature || 0
    const feelsLike = weatherData?.current.apparent_temperature || 0
    const precipitation = weatherData?.current.precipitation || 0
    const cloudCover = weatherData?.current.cloud_cover || 0

    return (
      <>
        {/* Hero Banner with Image Carousel */}
        <div className="mb-8 relative">
          <div className="relative h-[500px] overflow-hidden rounded-xl shadow-2xl">
            {/* Main Image */}
            <div className="absolute inset-0">
              <Image
                src={parkImages[currentImageIndex].url || "/placeholder.svg"}
                alt={parkImages[currentImageIndex].alt}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={() => openLightbox(currentImageIndex)}
              className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all z-10"
              aria-label="View fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                      {park.terrain[0]}
                    </Badge>
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30">{park.size}</Badge>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight">{park.name}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-white/90">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span className="text-lg">{park.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-semibold">{park.rating}</span>
                      <span className="text-white/70">({park.reviews} reviews)</span>
                    </div>
                  </div>
                  <p className="text-xl text-white/90 max-w-2xl leading-relaxed">{park.description}</p>
                </div>

                {/* Weather Card */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white min-w-[280px]">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="text-6xl">{weatherIcon}</div>
                      <div>
                        <p className="text-3xl font-bold">{currentTemp}°C</p>
                        <p className="text-white/80">Feels like {feelsLike}°C</p>
                        <p className="text-sm text-white/70 mt-2">{weatherDescription}</p>
                      </div>
                      {uvIndex >= 6 && (
                        <div className="bg-red-500/20 border border-red-300/30 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="w-4 h-4" />
                            <span>High UV - {uvInfo.level}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex justify-center mt-4 gap-2">
            {parkImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative h-16 w-24 rounded-md overflow-hidden transition-all ${
                  currentImageIndex === index ? "ring-2 ring-blue-500 ring-offset-2" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-400 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Mountain className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{park.size.split(" ")[0]}</div>
              <div className="text-sm opacity-90">Size</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Navigation className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{park.distance}</div>
              <div className="text-sm opacity-90">Distance</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-400 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Activity className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{park.facilities.length}</div>
              <div className="text-sm opacity-90">Facilities</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-400 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{park.rating}/5</div>
              <div className="text-sm opacity-90">Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Park Gallery Section */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <PawPrint className="w-6 h-6 text-green-600" />
              Park Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {parkImages.map((image, index) => (
                <div
                  key={index}
                  className="relative h-64 rounded-lg overflow-hidden shadow-md cursor-pointer group"
                  onClick={() => openLightbox(index)}
                >
                  <Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end">
                    <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-all">
                      <p className="font-medium">{image.caption}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <PawPrint className="w-6 h-6 text-green-600" />
                  About {park.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700 text-lg leading-relaxed">{park.longDescription || park.description}</p>

                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Mountain className="w-5 h-5 text-blue-600" />
                    Terrain & Environment
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {park.terrain.map((item, i) => (
                      <Card key={i} className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <CardContent className="p-3 flex items-center gap-2">
                          <TreePine className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-800 text-sm">{item}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {park.bestFor && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      Perfect For
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {park.bestFor.map((item, i) => (
                        <Card key={i} className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                          <CardContent className="p-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600" />
                            <span className="font-medium text-purple-800 text-sm">{item}</span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Activity className="w-6 h-6 text-blue-600" />
                  Facilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {park.facilities.map((facility, i) => (
                    <Card key={i} className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                          {facility.icon === "droplet" ? (
                            <Droplet className="w-5 h-5" />
                          ) : facility.icon === "car" ? (
                            <Car className="w-5 h-5" />
                          ) : facility.icon === "coffee" ? (
                            <Coffee className="w-5 h-5" />
                          ) : facility.icon === "waves" ? (
                            <Waves className="w-5 h-5" />
                          ) : (
                            <CheckCircle className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{facility.name}</h4>
                          {facility.description && (
                            <p className="text-gray-600 text-sm leading-relaxed">{facility.description}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Map className="w-6 h-6 text-green-600" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense
                  fallback={
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-sm text-gray-600">Loading map...</p>
                      </div>
                    </div>
                  }
                >
                  <GoogleMap
                    latitude={park.coordinates.latitude}
                    longitude={park.coordinates.longitude}
                    parkName={park.name}
                    address={park.address}
                    className="shadow-lg"
                  />
                </Suspense>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Address</h4>
                      <p className="text-blue-700 text-sm">{park.address}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Distance</h4>
                      <p className="text-green-700 text-sm">{park.distance} from Parramatta CBD</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather Details */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sun className="w-5 h-5 text-yellow-600" />
                  Weather Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                    <Thermometer className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <p className="text-2xl font-bold text-orange-800">{currentTemp}°C</p>
                    <p className="text-xs text-orange-600">Temperature</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <Cloud className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold text-blue-800">{cloudCover}%</p>
                    <p className="text-xs text-blue-600">Cloud Cover</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">UV Index</span>
                    <Badge variant={uvIndex >= 8 ? "destructive" : uvIndex >= 6 ? "secondary" : "default"}>
                      {uvIndex} - {uvInfo.level}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Sunrise</span>
                    <span className="font-medium text-sm">{sunrise}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Sunset</span>
                    <span className="font-medium text-sm">{sunset}</span>
                  </div>
                </div>

                {dogAdvice && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2 text-sm">Dog Weather Advice</h4>
                    <p className="text-green-700 text-sm">{dogAdvice}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                  onClick={getDirections}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
                <Button className="w-full shadow-lg" variant="outline" onClick={openInGoogleMaps}>
                  <Map className="w-4 h-4 mr-2" />
                  View on Google Maps
                </Button>
                {park.phone && (
                  <Button className="w-full shadow-lg" variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Park
                  </Button>
                )}
                {park.website && (
                  <Button className="w-full shadow-lg" variant="outline" asChild>
                    <a href={park.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Park Rules */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="w-5 h-5 text-red-600" />
                  Park Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Off-leash Areas</span>
                    <Badge variant={park.rules.offLeashAreas ? "default" : "secondary"}>
                      {park.rules.offLeashAreas ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Dog Water Access</span>
                    <Badge variant={park.rules.dogWaterAccess ? "default" : "secondary"}>
                      {park.rules.dogWaterAccess ? "Available" : "Bring Water"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Waste Bags</span>
                    <Badge variant={park.rules.bagDispenserAvailable ? "default" : "secondary"}>
                      {park.rules.bagDispenserAvailable ? "Provided" : "Bring Own"}
                    </Badge>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">Hours</h4>
                  <p className="text-gray-600 text-sm">{park.hours}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lightbox */}
        {showLightbox && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <div className="relative w-full max-w-6xl mx-auto p-4">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all z-10"
                aria-label="Close lightbox"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative h-[80vh]">
                <Image
                  src={parkImages[currentImageIndex].url || "/placeholder.svg"}
                  alt={parkImages[currentImageIndex].alt}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                <button
                  onClick={prevImage}
                  className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <div className="absolute bottom-20 left-0 right-0 text-center">
                <p className="text-white text-lg">{parkImages[currentImageIndex].caption}</p>
                <p className="text-white/70 text-sm">
                  {currentImageIndex + 1} / {parkImages.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  const openInGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${park.coordinates.latitude},${park.coordinates.longitude}`,
      "_blank",
    )
  }

  const getDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${park.coordinates.latitude},${park.coordinates.longitude}`,
      "_blank",
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href={isDemo ? "/parks?demo=true" : "/parks"}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Parks
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-xl font-semibold text-gray-900">{park.name}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={getDirections} className="hidden sm:flex">
                <Navigation className="w-4 h-4 mr-2" />
                Directions
              </Button>
              <Button variant="outline" size="sm" onClick={openInGoogleMaps} className="hidden sm:flex">
                <Map className="w-4 h-4 mr-2" />
                View on Maps
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WeatherComponent />
      </div>
    </div>
  )
}
