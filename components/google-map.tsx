"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Maximize2, Minimize2, ExternalLink } from "lucide-react"

interface GoogleMapProps {
  latitude: number
  longitude: number
  parkName: string
  address: string
  className?: string
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export function GoogleMap({ latitude, longitude, parkName, address, className = "" }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap()
        return
      }

      // Check if script is already loading
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        // Wait for it to load
        const checkGoogle = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkGoogle)
            initializeMap()
          }
        }, 100)
        return
      }

      // Load Google Maps script
      const script = document.createElement("script")
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&libraries=places"
      script.async = true
      script.defer = true
      script.onload = initializeMap
      script.onerror = () => setError("Failed to load Google Maps")
      document.head.appendChild(script)
    }

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return

      try {
        const mapOptions = {
          center: { lat: latitude, lng: longitude },
          zoom: 15,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: "poi.park",
              elementType: "geometry.fill",
              stylers: [{ color: "#a8e6a3" }],
            },
            {
              featureType: "poi.park",
              elementType: "labels.text.fill",
              stylers: [{ color: "#2d5a2d" }],
            },
            {
              featureType: "water",
              elementType: "geometry.fill",
              stylers: [{ color: "#74b9ff" }],
            },
          ],
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: false,
          zoomControl: true,
        }

        const newMap = new window.google.maps.Map(mapRef.current, mapOptions)

        // Add marker for the park
        const marker = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: newMap,
          title: parkName,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#10B981" stroke="white" strokeWidth="4"/>
                <path d="M20 10L24 18H16L20 10Z" fill="white"/>
                <circle cx="20" cy="25" r="3" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 40),
          },
        })

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">${parkName}</h3>
              <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; line-height: 1.4;">${address}</p>
              <div style="display: flex; gap: 8px;">
                <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}', '_blank')" 
                        style="background: #10B981; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer; font-weight: 500;">
                  Get Directions
                </button>
                <button onclick="window.open('https://www.google.com/maps/place/${latitude},${longitude}', '_blank')" 
                        style="background: #3B82F6; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer; font-weight: 500;">
                  View on Google Maps
                </button>
              </div>
            </div>
          `,
        })

        marker.addListener("click", () => {
          infoWindow.open(newMap, marker)
        })

        // Open info window by default
        infoWindow.open(newMap, marker)

        setMap(newMap)
        setIsLoaded(true)
      } catch (err) {
        setError("Failed to initialize map")
        console.error("Map initialization error:", err)
      }
    }

    loadGoogleMaps()
  }, [latitude, longitude, parkName, address])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const openInGoogleMaps = () => {
    window.open(`https://www.google.com/maps/place/${latitude},${longitude}`, "_blank")
  }

  const getDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, "_blank")
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={openInGoogleMaps} size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Google Maps
              </Button>
              <Button variant="outline" onClick={getDirections} size="sm">
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className={`${className} ${isFullscreen ? "fixed inset-4 z-50" : ""} transition-all duration-300`}>
        <CardContent className="p-0 relative">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleFullscreen}
              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={openInGoogleMaps}
              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={getDirections}
              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
            >
              <Navigation className="w-4 h-4" />
            </Button>
          </div>
          <div
            ref={mapRef}
            className={`w-full ${isFullscreen ? "h-full" : "h-64 md:h-80"} rounded-lg`}
            style={{ minHeight: isFullscreen ? "100%" : "256px" }}
          />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isFullscreen && <div className="fixed inset-0 bg-black/50 z-40" onClick={toggleFullscreen} />}
    </>
  )
}
