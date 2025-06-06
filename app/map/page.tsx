import { getWeatherData, getWeatherDescription, getWeatherIcon } from "@/lib/weather"
import { MapPageClient } from "@/components/map-page-client"

export default async function MapPage() {
  // Fetch weather data on the server
  const weatherData = await getWeatherData()
  const weatherDescription = weatherData ? getWeatherDescription(weatherData) : "Weather unavailable"
  const weatherIcon = weatherData ? getWeatherIcon(weatherData) : "🌤️"

  // Pass data to client component
  return <MapPageClient weatherDescription={weatherDescription} weatherIcon={weatherIcon} />
}
