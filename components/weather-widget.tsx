import { getWeatherData, getWeatherDescription, getWeatherIcon } from "@/lib/weather"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Thermometer, Droplets, Eye } from "lucide-react"

interface WeatherWidgetProps {
  latitude?: number
  longitude?: number
  parkName?: string
}

export async function WeatherWidget({
  latitude = -33.8688,
  longitude = 151.2093,
  parkName = "Current Location",
}: WeatherWidgetProps) {
  const weatherData = await getWeatherData(latitude, longitude)

  if (!weatherData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Weather data unavailable</p>
        </CardContent>
      </Card>
    )
  }

  const description = getWeatherDescription(weatherData)
  const icon = getWeatherIcon(weatherData)
  const { current, daily } = weatherData

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          Weather at {parkName}
        </CardTitle>
        <CardDescription>Current conditions and forecast</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Temperature</p>
              <p className="font-semibold">{current.temperature}°C</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Feels like</p>
              <p className="font-semibold">{current.apparent_temperature}°C</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Precipitation</p>
              <p className="font-semibold">{current.precipitation}mm</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Cloud Cover</p>
              <p className="font-semibold">{current.cloud_cover}%</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Today's Forecast</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">UV Index:</span>
              <span className="ml-2 font-medium">{Math.round(daily.uv_index_max[0] || 0)}</span>
            </div>
            <div>
              <span className="text-gray-600">Daylight:</span>
              <span className="ml-2 font-medium">{Math.round((daily.daylight_duration[0] || 0) / 3600)}h</span>
            </div>
            <div>
              <span className="text-gray-600">Sunrise:</span>
              <span className="ml-2 font-medium">
                {daily.sunrise[0]
                  ? new Date(daily.sunrise[0]).toLocaleTimeString("en-AU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Sunset:</span>
              <span className="ml-2 font-medium">
                {daily.sunset[0]
                  ? new Date(daily.sunset[0]).toLocaleTimeString("en-AU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 pt-2 border-t">Weather data provided by Open-Meteo API</div>
      </CardContent>
    </Card>
  )
}
