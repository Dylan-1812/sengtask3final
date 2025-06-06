"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, ArrowLeft, Filter, Search, PawPrintIcon as Paw, Info } from "lucide-react"
import { type Park, sydneyDogParks } from "@/lib/parks-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { getWeatherData, getWeatherDescription, getWeatherIcon } from "@/lib/weather"
import { useSearchParams } from "next/navigation"

interface ParksClientProps {
  initialWeatherDescription?: string
  initialWeatherIcon?: string
}

export function ParksClient({
  initialWeatherDescription = "Weather unavailable",
  initialWeatherIcon = "🌤️",
}: ParksClientProps) {
  const searchParams = useSearchParams()
  const isDemo = searchParams?.get("demo") === "true"

  const [searchTerm, setSearchTerm] = useState("")
  const [filteredParks, setFilteredParks] = useState<Park[]>(sydneyDogParks)
  const [sortBy, setSortBy] = useState("distance")
  const [filterOffLeash, setFilterOffLeash] = useState(false)
  const [filterFenced, setFilterFenced] = useState(false)
  const [filterWater, setFilterWater] = useState(false)
  const [maxDistance, setMaxDistance] = useState(30)
  const [weatherData, setWeatherData] = useState<Record<number, { description: string; icon: string }>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Initialise with default weather
  useEffect(() => {
    const initialWeather: Record<number, { description: string; icon: string }> = {}
    sydneyDogParks.forEach((park) => {
      initialWeather[park.id] = {
        description: initialWeatherDescription,
        icon: initialWeatherIcon,
      }
    })
    setWeatherData(initialWeather)

    // Load individual park weather data
    const loadParkWeather = async () => {
      setIsLoading(true)
      for (const park of sydneyDogParks) {
        try {
          const data = await getWeatherData(park.coordinates.latitude, park.coordinates.longitude)
          if (data) {
            setWeatherData((prev) => ({
              ...prev,
              [park.id]: {
                description: getWeatherDescription(data),
                icon: getWeatherIcon(data),
              },
            }))
          }
        } catch (error) {
          console.error(`Error fetching weather for ${park.name}:`, error)
        }
      }
      setIsLoading(false)
    }

    loadParkWeather()
  }, [initialWeatherDescription, initialWeatherIcon])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    applyFilters(term, sortBy, filterOffLeash, filterFenced, filterWater, maxDistance)
  }

  const handleSort = (value: string) => {
    setSortBy(value)
    applyFilters(searchTerm, value, filterOffLeash, filterFenced, filterWater, maxDistance)
  }

  const applyFilters = (
    term: string,
    sort: string,
    offLeash: boolean,
    fenced: boolean,
    water: boolean,
    distance: number,
  ) => {
    let filtered = sydneyDogParks.filter((park) => {
      // Search term filter
      const matchesTerm =
        park.name.toLowerCase().includes(term.toLowerCase()) ||
        park.location.toLowerCase().includes(term.toLowerCase()) ||
        park.description.toLowerCase().includes(term.toLowerCase())

      // Facility filters
      const matchesOffLeash = !offLeash || park.rules.offLeashAreas
      const matchesFenced = !fenced || park.facilities.some((f) => f.name === "Fully fenced")
      const matchesWater =
        !water ||
        park.facilities.some(
          (f) => f.name === "Water fountains" || f.name === "Dog water station" || f.name === "Swimming area",
        )

      // Distance filter - parse the distance string to get the number
      const parkDistance = Number.parseFloat(park.distance?.split(" ")[0] || "0")
      const matchesDistance = parkDistance <= distance

      return matchesTerm && matchesOffLeash && matchesFenced && matchesWater && matchesDistance
    })

    // Apply sorting
    if (sort === "rating") {
      filtered = filtered.sort((a, b) => b.rating - a.rating)
    } else if (sort === "distance") {
      filtered = filtered.sort((a, b) => {
        const distA = Number.parseFloat(a.distance?.split(" ")[0] || "0")
        const distB = Number.parseFloat(b.distance?.split(" ")[0] || "0")
        return distA - distB
      })
    } else if (sort === "reviews") {
      filtered = filtered.sort((a, b) => b.reviews - a.reviews)
    }

    setFilteredParks(filtered)
  }

  const handleFilterChange = (offLeash: boolean, fenced: boolean, water: boolean, distance: number) => {
    setFilterOffLeash(offLeash)
    setFilterFenced(fenced)
    setFilterWater(water)
    setMaxDistance(distance)
    applyFilters(searchTerm, sortBy, offLeash, fenced, water, distance)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Link
                href={isDemo ? "/dashboard?demo=true" : "/"}
                className="inline-flex items-center text-green-600 hover:text-green-700 transition-colours mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {isDemo ? "Dashboard" : "Home"}
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Parramatta Dog Parks</h1>
              <p className="text-gray-600 mt-1">
                Discover {sydneyDogParks.length} dog-friendly parks in the Parramatta area
              </p>
            </div>
            <Link href={isDemo ? "/map?demo=true" : "/map"}>
              <Button variant="outline" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                View Map
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search parks by name, location, or features..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Nearest First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviewed</SelectItem>
                </SelectContent>
              </Select>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Parks</SheetTitle>
                    <SheetDescription>Customise your search to find the perfect park for your dog.</SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Features</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="off-leash"
                            checked={filterOffLeash}
                            onCheckedChange={(checked) =>
                              handleFilterChange(checked as boolean, filterFenced, filterWater, maxDistance)
                            }
                          />
                          <Label htmlFor="off-leash">Off-leash areas</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="fenced"
                            checked={filterFenced}
                            onCheckedChange={(checked) =>
                              handleFilterChange(filterOffLeash, checked as boolean, filterWater, maxDistance)
                            }
                          />
                          <Label htmlFor="fenced">Fully fenced</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="water"
                            checked={filterWater}
                            onCheckedChange={(checked) =>
                              handleFilterChange(filterOffLeash, filterFenced, checked as boolean, maxDistance)
                            }
                          />
                          <Label htmlFor="water">Water access</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Maximum Distance</h3>
                        <span className="text-sm text-gray-500">{maxDistance} km</span>
                      </div>
                      <Slider
                        defaultValue={[maxDistance]}
                        max={30}
                        step={1}
                        onValueChange={(value) =>
                          handleFilterChange(filterOffLeash, filterFenced, filterWater, value[0])
                        }
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0 km</span>
                        <span>15 km</span>
                        <span>30 km</span>
                      </div>
                    </div>

                    <Button className="w-full" onClick={() => handleFilterChange(false, false, false, 30)}>
                      Reset Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {filteredParks.length} of {sydneyDogParks.length} parks
            {isLoading && " • Loading weather data..."}
          </p>
          <div className="text-sm text-gray-600 flex items-center gap-1">
            <Info className="w-3 h-3" />
            <span>Weather data updates hourly</span>
          </div>
        </div>

        {/* Parks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParks.map((park) => (
            <Card key={park.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={park.image || "/placeholder.svg"} alt={park.name} className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-sm font-medium">
                  {park.distance}
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{park.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {park.location}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{park.rating}</span>
                    <span className="text-gray-500">({park.reviews})</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-lg">{weatherData[park.id]?.icon || "🌤️"}</span>
                  {weatherData[park.id]?.description || "Weather data loading..."}
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{park.description}</p>

                <div className="flex flex-wrap gap-1">
                  {park.facilities.slice(0, 3).map((facility, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {facility.name}
                    </Badge>
                  ))}
                  {park.facilities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{park.facilities.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Link href={`/parks/${park.slug}${isDemo ? "?demo=true" : ""}`} className="flex-1">
                    <Button className="w-full bg-green-600 hover:bg-green-700" size="sm">
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/map?park=${park.id}${isDemo ? "&demo=true" : ""}`}>
                    <Button variant="outline" size="sm" className="px-3">
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredParks.length === 0 && (
          <div className="text-center py-12">
            <Paw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No parks found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <Button onClick={() => handleFilterChange(false, false, false, 30)}>Reset All Filters</Button>
          </div>
        )}
      </div>
    </div>
  )
}
