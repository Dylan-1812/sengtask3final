"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sun, Cloud, Thermometer, Droplet, AlertTriangle, Sunrise, Sunset, Timer, Activity } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface WeatherData {
  current?: {
    temperature_2m?: number
    apparent_temperature?: number
    precipitation?: number
    cloud_cover?: number
    wind_speed_10m?: number
  }
  daily?: {
    uv_index_max?: number[]
    sunrise?: string[]
    sunset?: string[]
    daylight_duration?: number[]
  }
}

interface EnhancedWeatherWidgetProps {
  weatherData?: WeatherData | null
  weatherDescription?: string
  weatherIcon?: string
  dogAdvice?: string
  uvInfo?: { level: string; advice: string }
  sunrise?: string
  sunset?: string
  daylightDuration?: string
}

export function EnhancedWeatherWidget({
  weatherData,
  weatherDescription = "Partly Cloudy",
  weatherIcon = "⛅",
  dogAdvice = "Good conditions for most dogs. Bring water and watch for signs of overheating.",
  uvInfo = { level: "Moderate", advice: "Use sunscreen and seek shade during midday hours." },
  sunrise = "6:30 AM",
  sunset = "7:45 PM",
  daylightDuration = "13h 15m",
}: EnhancedWeatherWidgetProps) {
  // If weather data is not available yet, show a loading state
  if (!weatherData) {
    return (
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Today's Weather</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Use safe access with default values
  const uvIndex = weatherData?.daily?.uv_index_max?.[0] ?? 5
  const temp = weatherData?.current?.temperature_2m ?? 22
  const feelsLike = weatherData?.current?.apparent_temperature ?? 22
  const precipitation = weatherData?.current?.precipitation ?? 0
  const cloudCover = weatherData?.current?.cloud_cover ?? 30
  const windSpeed = weatherData?.current?.wind_speed_10m ?? 5

  const getTemperatureColour = (temp: number) => {
    if (temp >= 30) return "from-red-400 to-red-600"
    if (temp >= 25) return "from-orange-400 to-orange-600"
    if (temp >= 20) return "from-yellow-400 to-yellow-600"
    if (temp >= 15) return "from-green-400 to-green-600"
    if (temp >= 10) return "from-blue-400 to-blue-600"
    return "from-purple-400 to-purple-600"
  }

  const getUVColour = (uv: number) => {
    if (uv >= 8) return "from-red-400 to-red-600"
    if (uv >= 6) return "from-orange-400 to-orange-600"
    if (uv >= 3) return "from-yellow-400 to-yellow-600"
    return "from-green-400 to-green-600"
  }

  const getComfortLevel = () => {
    if (temp >= 30 || temp <= 5) return { level: "Extreme", colour: "text-red-600", bg: "bg-red-50" }
    if (temp >= 25 || temp <= 10) return { level: "Caution", colour: "text-orange-600", bg: "bg-orange-50" }
    if (temp >= 20 && temp <= 25) return { level: "Perfect", colour: "text-green-600", bg: "bg-green-50" }
    return { level: "Good", colour: "text-blue-600", bg: "bg-blue-50" }
  }

  const comfort = getComfortLevel()

  return (
    <div className="space-y-6">
      {/* Current Conditions Header */}
      <Card className="bg-gradient-to-br from-blue-50 via-white to-green-50 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{weatherIcon}</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{temp}°C</h3>
                <p className="text-lg text-gray-600">{weatherDescription}</p>
                <p className="text-sm text-gray-500">Feels like {feelsLike}°C</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full ${comfort.bg}`}>
              <span className={`font-medium ${comfort.colour}`}>{comfort.level}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={`bg-gradient-to-br ${getTemperatureColour(temp)} text-white border-0 shadow-lg`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Thermometer className="w-6 h-6" />
              <div>
                <p className="text-sm opacity-90">Temperature</p>
                <p className="text-xl font-bold">{temp}°C</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Droplet className="w-6 h-6" />
              <div>
                <p className="text-sm opacity-90">Precipitation</p>
                <p className="text-xl font-bold">{precipitation}mm</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-400 to-gray-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Cloud className="w-6 h-6" />
              <div>
                <p className="text-sm opacity-90">Cloud Cover</p>
                <p className="text-xl font-bold">{cloudCover}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${getUVColour(uvIndex)} text-white border-0 shadow-lg`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Sun className="w-6 h-6" />
              <div>
                <p className="text-sm opacity-90">UV Index</p>
                <p className="text-xl font-bold">{uvIndex}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Weather Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Feels like</span>
              <span className="font-medium">{feelsLike}°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Wind speed</span>
              <span className="font-medium">{windSpeed} km/h</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cloud cover</span>
                <span className="font-medium">{cloudCover}%</span>
              </div>
              <Progress value={cloudCover} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">UV Index</span>
                <Badge variant={uvIndex >= 8 ? "destructive" : uvIndex >= 6 ? "secondary" : "default"}>
                  {uvIndex} - {uvInfo.level}
                </Badge>
              </div>
              <Progress value={(uvIndex / 12) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-yellow-600" />
              Sun & Daylight
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sunrise className="w-4 h-4 text-orange-500" />
                <span className="text-gray-600">Sunrise</span>
              </div>
              <span className="font-medium">{sunrise}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sunset className="w-4 h-4 text-orange-600" />
                <span className="text-gray-600">Sunset</span>
              </div>
              <span className="font-medium">{sunset}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600">Daylight</span>
              </div>
              <span className="font-medium">{daylightDuration}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dog Advice */}
      {dogAdvice && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 mb-2">Dog Weather Advice</h3>
                <p className="text-green-700">{dogAdvice}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* UV Warning */}
      {uvIndex >= 6 && (
        <Card
          className={`border-2 shadow-lg ${uvIndex >= 8 ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"}`}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className={`w-6 h-6 ${uvIndex >= 8 ? "text-red-600" : "text-orange-600"}`} />
              <div>
                <h3 className={`font-semibold mb-2 ${uvIndex >= 8 ? "text-red-800" : "text-orange-800"}`}>
                  UV Warning
                </h3>
                <p className={`${uvIndex >= 8 ? "text-red-700" : "text-orange-700"}`}>{uvInfo.advice}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
