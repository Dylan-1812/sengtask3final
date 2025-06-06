interface WeatherData {
  current: {
    temperature: number
    apparent_temperature: number
    precipitation: number
    rain: number
    showers: number
    cloud_cover: number
  }
  daily: {
    uv_index_max: number[]
    sunrise: string[]
    sunset: string[]
    daylight_duration: number[]
    sunshine_duration: number[]
  }
  location: {
    latitude: number
    longitude: number
  }
}

interface WeatherResponse {
  hourly: {
    time: string[]
    temperature_2m: number[]
    rain: number[]
    showers: number[]
    apparent_temperature: number[]
    precipitation: number[]
    cloud_cover_high: number[]
    cloud_cover_mid: number[]
    cloud_cover_low: number[]
  }
  daily: {
    time: string[]
    uv_index_max: number[]
    uv_index_clear_sky_max: number[]
    sunrise: string[]
    sunset: string[]
    daylight_duration: number[]
    sunshine_duration: number[]
  }
}

// Mock weather data for preview environment
function getMockWeatherData(latitude = -33.8688, longitude = 151.2093): WeatherData {
  const now = new Date()
  const hour = now.getHours()

  // Generate realistic Sydney weather based on time of day
  let temperature = 22
  let cloudCover = 30

  if (hour >= 6 && hour < 12) {
    temperature = 18 + Math.random() * 4 // Morning: 18-22°C
    cloudCover = 20 + Math.random() * 30
  } else if (hour >= 12 && hour < 18) {
    temperature = 24 + Math.random() * 6 // Afternoon: 24-30°C
    cloudCover = 10 + Math.random() * 40
  } else {
    temperature = 16 + Math.random() * 6 // Evening/Night: 16-22°C
    cloudCover = 40 + Math.random() * 30
  }

  const sunrise = new Date()
  sunrise.setHours(6, 30, 0, 0)

  const sunset = new Date()
  sunset.setHours(19, 45, 0, 0)

  return {
    current: {
      temperature: Math.round(temperature),
      apparent_temperature: Math.round(temperature + Math.random() * 2 - 1),
      precipitation: Math.random() > 0.8 ? Math.random() * 2 : 0,
      rain: Math.random() > 0.8 ? Math.random() * 1.5 : 0,
      showers: Math.random() > 0.9 ? Math.random() * 1 : 0,
      cloud_cover: Math.round(cloudCover),
    },
    daily: {
      uv_index_max: [Math.round(Math.random() * 8 + 3)], // 3-11 UV index
      sunrise: [sunrise.toISOString()],
      sunset: [sunset.toISOString()],
      daylight_duration: [13.25 * 60], // ~13.25 hours in minutes
      sunshine_duration: [10.5 * 60], // ~10.5 hours in minutes
    },
    location: {
      latitude,
      longitude,
    },
  }
}

// Check if we're in a preview environment
function isPreviewEnvironment(): boolean {
  if (typeof window === "undefined") return false

  const hostname = window.location.hostname
  return (
    hostname.includes("vusercontent.net") ||
    hostname.includes("v0.dev") ||
    hostname.includes("localhost") ||
    hostname === "127.0.0.1"
  )
}

export async function getWeatherData(latitude = -33.8688, longitude = 151.2093): Promise<WeatherData | null> {
  // Return mock data in preview environment
  if (isPreviewEnvironment()) {
    console.log("🌤️ Using mock weather data for preview environment")
    return getMockWeatherData(latitude, longitude)
  }

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=uv_index_max,uv_index_clear_sky_max,sunrise,sunset,daylight_duration,sunshine_duration&hourly=temperature_2m,rain,showers,apparent_temperature,precipitation,cloud_cover_high,cloud_cover_mid,cloud_cover_low&models=bom_access_global&timezone=Australia%2FSydney`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
        signal: AbortSignal.timeout(10000), // 10 second timeout
      },
    )

    if (!response.ok) {
      throw new Error(`Weather API request failed: ${response.status} ${response.statusText}`)
    }

    const data: WeatherResponse = await response.json()

    // Validate response data
    if (!data.hourly || !data.daily) {
      throw new Error("Invalid weather API response structure")
    }

    // Get current hour index
    const now = new Date()
    const currentHour = now.getHours()
    const todayIndex = 0 // Today's data

    // Calculate average cloud cover with fallback
    const cloudCoverHigh = data.hourly.cloud_cover_high?.[currentHour] || 0
    const cloudCoverMid = data.hourly.cloud_cover_mid?.[currentHour] || 0
    const cloudCoverLow = data.hourly.cloud_cover_low?.[currentHour] || 0
    const cloudCover = Math.round((cloudCoverHigh + cloudCoverMid + cloudCoverLow) / 3)

    return {
      current: {
        temperature: Math.round(data.hourly.temperature_2m?.[currentHour] || 20),
        apparent_temperature: Math.round(data.hourly.apparent_temperature?.[currentHour] || 20),
        precipitation: data.hourly.precipitation?.[currentHour] || 0,
        rain: data.hourly.rain?.[currentHour] || 0,
        showers: data.hourly.showers?.[currentHour] || 0,
        cloud_cover: cloudCover,
      },
      daily: {
        uv_index_max: data.daily.uv_index_max || [5],
        sunrise: data.daily.sunrise || [],
        sunset: data.daily.sunset || [],
        daylight_duration: data.daily.daylight_duration || [],
        sunshine_duration: data.daily.sunshine_duration || [],
      },
      location: {
        latitude,
        longitude,
      },
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)

    // Return mock data as fallback
    console.log("🌤️ Using mock weather data as fallback")
    return getMockWeatherData(latitude, longitude)
  }
}

export function getWeatherDescription(weather: WeatherData): string {
  const { temperature, precipitation, rain, showers, cloud_cover } = weather.current

  let condition = "Clear"

  if (precipitation > 0 || rain > 0 || showers > 0) {
    if (precipitation > 2 || rain > 2 || showers > 2) {
      condition = "Heavy Rain"
    } else if (precipitation > 0.5 || rain > 0.5 || showers > 0.5) {
      condition = "Light Rain"
    } else {
      condition = "Drizzle"
    }
  } else if (cloud_cover > 80) {
    condition = "Overcast"
  } else if (cloud_cover > 50) {
    condition = "Cloudy"
  } else if (cloud_cover > 25) {
    condition = "Partly Cloudy"
  } else {
    condition = "Sunny"
  }

  return `${temperature}°C ${condition}`
}

export function getWeatherIcon(weather: WeatherData): string {
  const { precipitation, rain, showers, cloud_cover } = weather.current

  if (precipitation > 0 || rain > 0 || showers > 0) {
    return "🌧️"
  } else if (cloud_cover > 80) {
    return "☁️"
  } else if (cloud_cover > 50) {
    return "⛅"
  } else if (cloud_cover > 25) {
    return "🌤️"
  } else {
    return "☀️"
  }
}

export function formatSunTime(timeString: string): string {
  if (!timeString) return "N/A"
  const date = new Date(timeString)
  return date.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit", hour12: true })
}

export function formatDuration(minutes: number): string {
  if (!minutes) return "N/A"
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export function getUVDescription(uvIndex: number): { level: string; advice: string } {
  if (uvIndex >= 11) {
    return {
      level: "Extreme",
      advice: "Avoid outside time during midday. Seek shade, cover up, and use SPF 50+ sunscreen.",
    }
  } else if (uvIndex >= 8) {
    return {
      level: "Very High",
      advice: "Minimise sun exposure between 10am-4pm. Use SPF 50+ sunscreen and protective clothing.",
    }
  } else if (uvIndex >= 6) {
    return {
      level: "High",
      advice: "Reduce sun exposure between 10am-4pm. Use SPF 30+ sunscreen and hat.",
    }
  } else if (uvIndex >= 3) {
    return {
      level: "Moderate",
      advice: "Stay in shade near midday. Use SPF 30+ sunscreen.",
    }
  } else {
    return {
      level: "Low",
      advice: "No protection needed for most dogs and people.",
    }
  }
}

export function getDogWeatherAdvice(weather: WeatherData): string {
  const { temperature, precipitation } = weather.current
  const uvIndex = weather.daily.uv_index_max[0] || 0

  const advice = []

  // Temperature advice
  if (temperature > 30) {
    advice.push("Very hot conditions - limit exercise to early morning or evening.")
  } else if (temperature > 25) {
    advice.push("Warm conditions - bring extra water and watch for signs of overheating.")
  } else if (temperature < 5) {
    advice.push("Cold conditions - consider a dog coat for short-haired breeds.")
  } else {
    advice.push("Comfortable temperature for most dogs.")
  }

  // UV advice
  if (uvIndex >= 8) {
    advice.push("Extreme UV - avoid midday sun and consider dog-safe sunscreen for exposed skin areas.")
  } else if (uvIndex >= 6) {
    advice.push("High UV - seek shaded areas and limit direct sun exposure.")
  }

  // Rain advice
  if (precipitation > 2) {
    advice.push("Heavy rain expected - bring towels and consider waterproof gear.")
  } else if (precipitation > 0) {
    advice.push("Light rain possible - be prepared for wet conditions.")
  }

  return advice.join(" ")
}
