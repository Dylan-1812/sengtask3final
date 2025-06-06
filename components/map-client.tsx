"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Maximize, ZoomIn, ZoomOut, Locate, Loader2 } from "lucide-react"

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "400px",
}

interface MapClientProps {
  latitude?: number
  longitude?: number
  parkName?: string
  address?: string
}

export function MapClient({
  latitude = -33.8124,
  longitude = 151.0051,
  parkName = "Parramatta Park",
  address = "Parramatta, NSW",
}: MapClientProps) {
  const [zoom, setZoom] = useState(15)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [showUserLocationInfo, setShowUserLocationInfo] = useState(false)

  const toggleFullscreen = () => {
    const mapElement = document.getElementById("fallback-map-container")
    if (mapElement) {
      if (!isFullscreen) {
        if (mapElement.requestFullscreen) {
          mapElement.requestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, "_blank")
  }

  const getDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, "_blank")
  }

  const getMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser")
      return
    }

    setLocationLoading(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords
        setUserLocation({ lat, lng })
        setLocationLoading(false)
        setShowUserLocationInfo(true)

        // Auto-hide the location info after 3 seconds
        setTimeout(() => {
          setShowUserLocationInfo(false)
        }, 3000)
      },
      (error) => {
        setLocationLoading(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied by user")
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information unavailable")
            break
          case error.TIMEOUT:
            setLocationError("Location request timed out")
            break
          default:
            setLocationError("An unknown error occurred")
            break
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return distance
  }

  const getDirectionsFromMyLocation = () => {
    if (userLocation) {
      window.open(
        `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${latitude},${longitude}`,
        "_blank",
      )
    }
  }

  const zoomIn = () => setZoom(Math.min(zoom + 2, 20))
  const zoomOut = () => setZoom(Math.max(zoom - 2, 8))

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Calculate distance if user location is available
  const distanceTopark = userLocation
    ? calculateDistance(userLocation.lat, userLocation.lng, latitude, longitude)
    : null

  return (
    <div id="fallback-map-container" className="relative w-full h-full">
      {/* Interactive Fallback Map */}
      <div
        className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden rounded-lg border-2 border-green-200"
        style={mapContainerStyle}
      >
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
            {Array.from({ length: 96 }).map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>

        {/* Park Location Marker */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-full z-10"
          style={{
            left: "50%",
            top: "45%",
          }}
        >
          <div
            className="bg-red-500 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-red-600 transition-all duration-200 hover:scale-110 animate-bounce"
            onClick={() => setShowInfo(!showInfo)}
          >
            <MapPin className="w-6 h-6" />
          </div>

          {/* Park Info Popup */}
          {showInfo && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl p-4 min-w-64 border z-20">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-1">{parkName}</h3>
                <p className="text-sm text-gray-600 mb-2">{address}</p>
                {distanceTopark && (
                  <p className="text-xs text-green-600 font-medium mb-3">
                    📍 {distanceTopark.toFixed(1)} km from your location
                  </p>
                )}
                <div className="flex gap-2 justify-center">
                  <Button
                    size="sm"
                    onClick={userLocation ? getDirectionsFromMyLocation : getDirections}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    Directions
                  </Button>
                  <Button size="sm" variant="outline" onClick={openGoogleMaps}>
                    View Map
                  </Button>
                </div>
              </div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t rotate-45"></div>
            </div>
          )}
        </div>

        {/* User Location Marker */}
        {userLocation && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              left: "30%", // Position relative to park
              top: "60%",
            }}
          >
            <div
              className="bg-blue-500 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-600 transition-all duration-200 relative"
              onClick={() => setShowUserLocationInfo(!showUserLocationInfo)}
            >
              <Locate className="w-4 h-4" />
              {/* Pulsing ring animation */}
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
            </div>

            {/* User Location Info Popup */}
            {showUserLocationInfo && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl p-3 min-w-48 border z-20">
                <div className="text-center">
                  <h4 className="font-medium text-gray-900 mb-1">Your Location</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </p>
                  {distanceTopark && (
                    <p className="text-xs text-blue-600 font-medium">
                      {distanceTopark.toFixed(1)} km to {parkName}
                    </p>
                  )}
                </div>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t rotate-45"></div>
              </div>
            )}
          </div>
        )}

        {/* Nearby Parks Indicators */}
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <div
            className="bg-green-500 text-white p-2 rounded-full shadow-md hover:bg-green-600 cursor-pointer"
            title="Lake Parramatta Reserve"
          >
            <MapPin className="w-4 h-4" />
          </div>
        </div>

        <div className="absolute top-3/4 right-1/3 transform translate-x-1/2 -translate-y-1/2">
          <div
            className="bg-green-500 text-white p-2 rounded-full shadow-md hover:bg-green-600 cursor-pointer"
            title="Granville Park"
          >
            <MapPin className="w-4 h-4" />
          </div>
        </div>

        <div className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2 translate-y-1/2">
          <div
            className="bg-green-500 text-white p-2 rounded-full shadow-md hover:bg-green-600 cursor-pointer"
            title="Merrylands Park"
          >
            <MapPin className="w-4 h-4" />
          </div>
        </div>

        {/* Map Labels */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
          <div className="text-sm font-medium text-gray-900">Parramatta Area</div>
          <div className="text-xs text-gray-600">Dog Parks Map</div>
          {userLocation && <div className="text-xs text-blue-600 mt-1">📍 Your location detected</div>}
        </div>

        {/* Zoom Level Indicator */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
          <div className="text-xs text-gray-600">Zoom: {zoom}</div>
        </div>

        {/* Compass */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-red-500">N</div>
            <div className="absolute inset-0 border-2 border-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <Button
          size="sm"
          variant="secondary"
          className="w-10 h-10 p-0 bg-white shadow-md hover:bg-gray-50"
          onClick={toggleFullscreen}
          title="Toggle fullscreen"
        >
          <Maximize className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="w-10 h-10 p-0 bg-white shadow-md hover:bg-gray-50"
          onClick={zoomIn}
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="w-10 h-10 p-0 bg-white shadow-md hover:bg-gray-50"
          onClick={zoomOut}
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-4 right-4 space-y-2">
        <Button size="sm" className="bg-green-600 hover:bg-green-700 shadow-md" onClick={getDirections}>
          <Navigation className="w-4 h-4 mr-2" />
          Get Directions
        </Button>
        <Button size="sm" variant="outline" className="bg-white shadow-md hover:bg-gray-50" onClick={openGoogleMaps}>
          <MapPin className="w-4 h-4 mr-2" />
          View on Google Maps
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-white shadow-md hover:bg-gray-50"
          onClick={getMyLocation}
          disabled={locationLoading}
        >
          {locationLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Locate className="w-4 h-4 mr-2" />}
          My Location
        </Button>
      </div>

      {/* Location Error Message */}
      {locationError && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 rounded-lg p-3 max-w-xs z-30">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0">⚠️</div>
            <div className="text-xs text-red-800">
              <div className="font-medium mb-1">Location Error</div>
              <div>{locationError}</div>
            </div>
          </div>
          <Button size="sm" variant="ghost" className="mt-2 text-xs h-6 px-2" onClick={() => setLocationError(null)}>
            Dismiss
          </Button>
        </div>
      )}

      {/* API Notice */}
      <div className="absolute bottom-20 left-4 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <div className="font-medium mb-1">Interactive Map View</div>
            <div>Click markers for details. Use "My Location" to see distance to parks.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
