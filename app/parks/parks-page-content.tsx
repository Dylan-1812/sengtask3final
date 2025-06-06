import { ParksClient } from "@/components/parks-client"
import { getWeatherData, getWeatherDescription, getWeatherIcon } from "@/lib/weather"

export async function ParksPageContent() {
  // Fetch default weather data for Sydney
  const weatherData = await getWeatherData()
  const weatherDescription = weatherData ? getWeatherDescription(weatherData) : "Weather unavailable"
  const weatherIcon = weatherData ? getWeatherIcon(weatherData) : "🌤️"

  return <ParksClient initialWeatherDescription={weatherDescription} initialWeatherIcon={weatherIcon} />
}
