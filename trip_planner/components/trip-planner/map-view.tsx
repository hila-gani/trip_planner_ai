"use client"

import { useEffect, useRef } from "react"
import type { TripItinerary } from "@/lib/types"

interface MapViewProps {
  itinerary: TripItinerary
}

export default function MapView({ itinerary }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)

  useEffect(() => {
    if (!window.google || !mapRef.current) return

    const hotelCoords = {
      lat: itinerary.accommodation.coordinates.lat,
      lng: itinerary.accommodation.coordinates.lng,
    }

    const points: google.maps.LatLngLiteral[] = [hotelCoords]

    itinerary.days.forEach((day) => {
      day.activities.forEach((activity) => {
        if (activity.coordinates) {
          points.push({
            lat: activity.coordinates.lat,
            lng: activity.coordinates.lng,
          })
        }
      })
    })

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        zoom: 12,
        center: hotelCoords,
      })
    }

    const map = mapInstanceRef.current

    // מציג מסלול
    const directionsService = new google.maps.DirectionsService()

    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        draggable: true, // מאפשר למשתמש לגרור מסלול
      })
    } else {
      directionsRendererRef.current.setMap(map)
    }

    // מוסיפים סימונים ידניים (כי suppressMarkers: true)
    const addMarker = (position: google.maps.LatLngLiteral, label: string, title: string) => {
      new google.maps.Marker({
        position,
        map,
        label,
        title,
      })
    }

    points.forEach((point, idx) => {
      const title =
        idx === 0 ? itinerary.accommodation.name : itinerary.days.flatMap((d) => d.activities)[idx - 1].title
      addMarker(point, `${idx + 1}`, title)
    })

    // יצירת רשימת תחנות ביניים
    const waypoints = points.slice(1, -1).map((loc) => ({
      location: new google.maps.LatLng(loc.lat, loc.lng),
      stopover: true,
    }))

    directionsService.route(
      {
        origin: points[0],
        destination: points[points.length - 1],
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          directionsRendererRef.current?.setDirections(result)
        } else {
          console.error("Directions request failed due to " + status)
        }
      }
    )

    return () => {
      directionsRendererRef.current?.setMap(null)
    }
  }, [itinerary])

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
}
;