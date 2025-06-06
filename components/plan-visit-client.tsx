"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  CalendarIcon,
  Clock,
  MapPin,
  Sun,
  Droplet,
  Wind,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  PawPrint,
  Camera,
  Users,
  Heart,
  Share2,
  Download,
  Bell,
  Navigation,
  Smartphone,
  Umbrella,
  Zap,
  TreePine,
  Activity,
} from "lucide-react"
import { sydneyDogParks } from "@/lib/parks-data"
import { getWeatherData, getWeatherDescription, getWeatherIcon, getDogWeatherAdvice } from "@/lib/weather"

interface PageProps {
  searchParams: { demo?: string; park?: string }
}

export function PlanVisitClient({ searchParams }: PageProps) {
  const isDemo = searchParams.demo === "true"
  const selectedParkSlug = searchParams.park

  const [selectedPark, setSelectedPark] = useState(
    selectedParkSlug ? sydneyDogParks.find((p) => p.slug === selectedParkSlug) || sydneyDogParks[0] : sydneyDogParks[0],
  )
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState("morning")
  const [visitDuration, setVisitDuration] = useState("1-2")
  const [dogSize, setDogSize] = useState("medium")
  const [dogEnergy, setDogEnergy] = useState("medium")
  const [weatherData, setWeatherData] = useState<any>(null)
  const [checklist, setChecklist] = useState({
    water: false,
    treats: false,
    leash: false,
    bags: false,
    towel: false,
    toys: false,
    firstAid: false,
    camera: false,
  })
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const fetchWeather = async () => {
      if (selectedPark) {
        const weather = await getWeatherData(selectedPark.coordinates.latitude, selectedPark.coordinates.longitude)
        setWeatherData(weather)
      }
    }
    fetchWeather()
  }, [selectedPark])

  const timeSlots = [
    { value: "early-morning", label: "Early Morning (6-8 AM)", icon: "🌅", crowd: "Low", temp: "Cool" },
    { value: "morning", label: "Morning (8-11 AM)", icon: "☀️", crowd: "Medium", temp: "Pleasant" },
    { value: "midday", label: "Midday (11 AM-2 PM)", icon: "🌞", crowd: "High", temp: "Warm" },
    { value: "afternoon", label: "Afternoon (2-5 PM)", icon: "🌤️", crowd: "Medium", temp: "Warm" },
    { value: "evening", label: "Evening (5-7 PM)", icon: "🌅", crowd: "High", temp: "Cool" },
    { value: "late-evening", label: "Late Evening (7-9 PM)", icon: "🌆", crowd: "Low", temp: "Cool" },
  ]

  const getRecommendations = () => {
    const recommendations = []
    const currentTemp = weatherData?.current?.temperature || 20
    const uvIndex = weatherData?.daily?.uv_index_max?.[0] || 5
    const precipitation = weatherData?.current?.precipitation || 0

    // Weather-based recommendations
    if (currentTemp > 25) {
      recommendations.push({
        type: "warning",
        icon: <Thermometer className="w-5 h-5" />,
        title: "Hot Weather Alert",
        description: "Bring extra water and consider early morning or evening visits. Watch for hot pavement.",
      })
    }

    if (uvIndex >= 8) {
      recommendations.push({
        type: "warning",
        icon: <Sun className="w-5 h-5" />,
        title: "High UV Index",
        description: "Seek shade frequently. Consider protective gear for light-colored dogs.",
      })
    }

    if (precipitation > 5) {
      recommendations.push({
        type: "info",
        icon: <Umbrella className="w-5 h-5" />,
        title: "Rainy Conditions",
        description: "Bring towels and consider waterproof gear. Muddy conditions expected.",
      })
    }

    // Time-based recommendations
    if (selectedTime === "midday") {
      recommendations.push({
        type: "warning",
        icon: <Clock className="w-5 h-5" />,
        title: "Peak Hours",
        description: "Expect crowds and higher temperatures. Consider alternative times.",
      })
    }

    // Dog-specific recommendations
    if (dogEnergy === "high") {
      recommendations.push({
        type: "success",
        icon: <Activity className="w-5 h-5" />,
        title: "High Energy Dog",
        description: "Perfect for longer visits! Bring extra toys and consider agility areas.",
      })
    }

    if (dogSize === "small") {
      recommendations.push({
        type: "info",
        icon: <PawPrint className="w-5 h-5" />,
        title: "Small Dog Tips",
        description: "Look for dedicated small dog areas. Watch for larger dogs during busy times.",
      })
    }

    return recommendations
  }

  const generateItinerary = () => {
    const timeSlot = timeSlots.find((t) => t.value === selectedTime)
    const duration = Number.parseInt(visitDuration.split("-")[0])

    return [
      {
        time: "15 mins before",
        activity: "Preparation",
        description: "Check weather, pack supplies, and prepare your dog",
        icon: <CheckCircle className="w-4 h-4" />,
      },
      {
        time: "Arrival",
        activity: "Park Assessment",
        description: "Check conditions, other dogs, and choose the best area",
        icon: <MapPin className="w-4 h-4" />,
      },
      {
        time: "First 30 mins",
        activity: "Exploration & Socialization",
        description: "Let your dog explore and meet other dogs gradually",
        icon: <Users className="w-4 h-4" />,
      },
      ...(duration > 1
        ? [
            {
              time: "Mid-visit",
              activity: "Active Play",
              description: "Engage in fetch, training, or agility activities",
              icon: <Activity className="w-4 h-4" />,
            },
          ]
        : []),
      {
        time: "Before leaving",
        activity: "Wind Down",
        description: "Calm activities, water break, and cleanup",
        icon: <Heart className="w-4 h-4" />,
      },
    ]
  }

  const handleChecklistChange = (item: string, checked: boolean) => {
    setChecklist((prev) => ({ ...prev, [item]: checked }))
  }

  const exportPlan = () => {
    const plan = {
      park: selectedPark?.name,
      date: selectedDate.toDateString(),
      time: timeSlots.find((t) => t.value === selectedTime)?.label,
      duration: `${visitDuration} hours`,
      checklist,
      notes,
      recommendations: getRecommendations(),
      itinerary: generateItinerary(),
    }

    const dataStr = JSON.stringify(plan, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `tail-trails-visit-plan-${selectedDate.toISOString().split("T")[0]}.json`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href={isDemo ? "/dashboard?demo=true" : "/"}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                {isDemo ? "Back to Dashboard" : "Back to Home"}
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-xl font-semibold text-gray-900">Plan Your Visit</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={exportPlan}>
                <Download className="w-4 h-4 mr-2" />
                Export Plan
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Plan the Perfect Park Visit</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get personalized recommendations, weather insights, and a complete checklist for your dog park adventure
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Planning Interface */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="basics" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="basics" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Basics
                </TabsTrigger>
                <TabsTrigger value="timing" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Timing
                </TabsTrigger>
                <TabsTrigger value="checklist" className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Checklist
                </TabsTrigger>
                <TabsTrigger value="itinerary" className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Itinerary
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basics" className="space-y-6">
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-green-600" />
                      Choose Your Park
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sydneyDogParks.map((park) => (
                        <Card
                          key={park.id}
                          className={`cursor-pointer transition-all hover:shadow-lg ${
                            selectedPark?.id === park.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedPark(park)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white">
                                <TreePine className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{park.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{park.location}</p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {park.size.split(" ")[0]}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {park.distance}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <PawPrint className="w-6 h-6 text-purple-600" />
                      Your Dog's Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dog-size" className="text-sm font-medium">
                          Dog Size
                        </Label>
                        <Select value={dogSize} onValueChange={setDogSize}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small (under 25 lbs)</SelectItem>
                            <SelectItem value="medium">Medium (25-60 lbs)</SelectItem>
                            <SelectItem value="large">Large (60-90 lbs)</SelectItem>
                            <SelectItem value="giant">Giant (over 90 lbs)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="dog-energy" className="text-sm font-medium">
                          Energy Level
                        </Label>
                        <Select value={dogEnergy} onValueChange={setDogEnergy}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select energy level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low - Prefers calm activities</SelectItem>
                            <SelectItem value="medium">Medium - Balanced play and rest</SelectItem>
                            <SelectItem value="high">High - Loves active play</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timing" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <CalendarIcon className="w-6 h-6 text-blue-600" />
                        Select Date
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                      />
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Clock className="w-6 h-6 text-orange-600" />
                        Time & Duration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Time of Visit</Label>
                        <div className="space-y-2">
                          {timeSlots.map((slot) => (
                            <div
                              key={slot.value}
                              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                selectedTime === slot.value
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:bg-gray-50"
                              }`}
                              onClick={() => setSelectedTime(slot.value)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{slot.icon}</span>
                                  <div>
                                    <p className="font-medium text-sm">{slot.label}</p>
                                    <div className="flex gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {slot.crowd} crowd
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {slot.temp}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="duration" className="text-sm font-medium">
                          Visit Duration
                        </Label>
                        <Select value={visitDuration} onValueChange={setVisitDuration}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.5-1">30 minutes - 1 hour</SelectItem>
                            <SelectItem value="1-2">1 - 2 hours</SelectItem>
                            <SelectItem value="2-3">2 - 3 hours</SelectItem>
                            <SelectItem value="3+">3+ hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="checklist" className="space-y-6">
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      Pre-Visit Checklist
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: "water", label: "Water bowl & fresh water", icon: <Droplet className="w-4 h-4" /> },
                        { key: "treats", label: "Dog treats & rewards", icon: <Heart className="w-4 h-4" /> },
                        { key: "leash", label: "Leash & collar with ID", icon: <PawPrint className="w-4 h-4" /> },
                        { key: "bags", label: "Waste bags", icon: <CheckCircle className="w-4 h-4" /> },
                        { key: "towel", label: "Towel for cleanup", icon: <Wind className="w-4 h-4" /> },
                        { key: "toys", label: "Favorite toys", icon: <Activity className="w-4 h-4" /> },
                        { key: "firstAid", label: "Basic first aid kit", icon: <AlertTriangle className="w-4 h-4" /> },
                        { key: "camera", label: "Camera for memories", icon: <Camera className="w-4 h-4" /> },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                          <Checkbox
                            id={item.key}
                            checked={checklist[item.key as keyof typeof checklist]}
                            onCheckedChange={(checked) => handleChecklistChange(item.key, checked as boolean)}
                          />
                          <div className="flex items-center gap-2">
                            {item.icon}
                            <Label htmlFor={item.key} className="text-sm font-medium cursor-pointer">
                              {item.label}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Label htmlFor="notes" className="text-sm font-medium">
                        Additional Notes
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special considerations, reminders, or notes for your visit..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="itinerary" className="space-y-6">
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CalendarIcon className="w-6 h-6 text-purple-600" />
                      Your Visit Itinerary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generateItinerary().map((item, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white">
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-purple-800">{item.time}</span>
                              <Badge variant="outline" className="text-xs">
                                {item.activity}
                              </Badge>
                            </div>
                            <p className="text-gray-700 text-sm">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather Card */}
            {weatherData && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Sun className="w-5 h-5 text-yellow-600" />
                    Weather Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-6xl mb-2">{getWeatherIcon(weatherData)}</div>
                    <p className="text-2xl font-bold">{weatherData.current?.temperature || 0}°C</p>
                    <p className="text-gray-600">{getWeatherDescription(weatherData)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <Wind className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                      <p className="text-sm font-bold">{weatherData.current?.wind_speed_10m || 0} km/h</p>
                      <p className="text-xs text-blue-600">Wind</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                      <Sun className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                      <p className="text-sm font-bold">{weatherData.daily?.uv_index_max?.[0] || 0}</p>
                      <p className="text-xs text-orange-600">UV Index</p>
                    </div>
                  </div>

                  {getDogWeatherAdvice(weatherData) && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2 text-sm">Dog Weather Advice</h4>
                      <p className="text-green-700 text-sm">{getDogWeatherAdvice(weatherData)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Smart Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getRecommendations().map((rec, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      rec.type === "warning"
                        ? "border-red-200 bg-red-50"
                        : rec.type === "info"
                          ? "border-blue-200 bg-blue-50"
                          : "border-green-200 bg-green-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          rec.type === "warning"
                            ? "bg-red-500 text-white"
                            : rec.type === "info"
                              ? "bg-blue-500 text-white"
                              : "bg-green-500 text-white"
                        }`}
                      >
                        {rec.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                        <p className="text-xs text-gray-600">{rec.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
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
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${selectedPark?.coordinates.latitude},${selectedPark?.coordinates.longitude}`,
                      "_blank",
                    )
                  }
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
                <Button variant="outline" className="w-full">
                  <Bell className="w-4 h-4 mr-2" />
                  Set Reminder
                </Button>
                <Button variant="outline" className="w-full">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>
                <Link href={`/parks/${selectedPark?.slug}${isDemo ? "?demo=true" : ""}`} className="block">
                  <Button variant="outline" className="w-full">
                    <MapPin className="w-4 h-4 mr-2" />
                    View Park Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
