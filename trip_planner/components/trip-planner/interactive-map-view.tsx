"use client"

import { useEffect, useRef } from "react"
import type { TripItinerary, Activity } from "@/lib/types"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

interface InteractiveMapViewProps {
  itinerary: TripItinerary
  selectedActivity: Activity | null
  selectedDay: number
  onActivitySelect: (activity: Activity) => void
}

export default function InteractiveMapView({
  itinerary,
  selectedActivity,
  selectedDay,
  onActivitySelect,
}: InteractiveMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const routeLineRef = useRef<L.Polyline | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([itinerary.coordinates.lat, itinerary.coordinates.lng], 13)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current)
    }

    // Clear existing markers and route line
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current?.removeLayer(marker)
    })
    markersRef.current = []

    if (routeLineRef.current) {
      mapInstanceRef.current.removeLayer(routeLineRef.current)
      routeLineRef.current = null
    }

    // Add accommodation marker
    const hotelMarker = L.marker([itinerary.accommodation.coordinates.lat, itinerary.accommodation.coordinates.lng], {
      icon: L.divIcon({
        html: `<div class="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full border-4 border-white shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/></svg>
                </div>`,
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      }),
    })
      .addTo(mapInstanceRef.current)
      .bindTooltip("Hotel: " + itinerary.accommodation.name, { permanent: false, direction: "top" })

    markersRef.current.push(hotelMarker)

    // Add markers for ALL days, but highlight current day and selected activity
    const routePoints: L.LatLngExpression[] = []

    // Start from hotel
    routePoints.push([itinerary.accommodation.coordinates.lat, itinerary.accommodation.coordinates.lng])

    itinerary.days.forEach((day, dayIndex) => {
      day.activities
        .filter((activity) => activity.coordinates)
        .forEach((activity, actIndex) => {
          if (activity.coordinates) {
            const isCurrentDay = dayIndex === selectedDay
            const isSelected = selectedActivity === activity
            const dayColors = [
              "bg-red-500",
              "bg-blue-500",
              "bg-green-500",
              "bg-purple-500",
              "bg-orange-500",
              "bg-teal-500",
              "bg-pink-500",
            ]
            const dayColor = dayColors[dayIndex % dayColors.length]

            // Add point to route only for current day
            if (isCurrentDay) {
              routePoints.push([activity.coordinates.lat, activity.coordinates.lng])
            }

            // Create marker with different styles based on day and selection
            const marker = L.marker([activity.coordinates.lat, activity.coordinates.lng], {
              icon: L.divIcon({
                html: `<div class="relative">
                        ${
                          isSelected
                            ? `<div class="absolute -inset-2 bg-yellow-400 rounded-full animate-pulse opacity-75"></div>`
                            : ""
                        }
                        <div class="flex items-center justify-center w-8 h-8 ${
                          isSelected
                            ? "bg-yellow-500 scale-125 shadow-xl ring-2 ring-yellow-300"
                            : isCurrentDay
                              ? dayColor
                              : "bg-gray-400"
                        } text-white rounded-full border-3 border-white shadow-lg transition-all duration-300 cursor-pointer relative z-10 ${
                          isCurrentDay ? "opacity-100" : "opacity-60"
                        }">
                          <span class="text-xs font-bold">${actIndex + 1}</span>
                        </div>
                      </div>`,
                className: "",
                iconSize: [32, 32],
                iconAnchor: [16, 16],
              }),
            })
              .addTo(mapInstanceRef.current!)
              .bindTooltip(`Day ${dayIndex + 1} - ${actIndex + 1}. ${activity.title} (${activity.time})`, {
                permanent: false,
                direction: "top",
                offset: [0, -10],
              })

            // Add click event to select activity
            marker.on("click", () => {
              onActivitySelect(activity)
            })

            markersRef.current.push(marker)
          }
        })
    })

    // Add current day activities to route and end at hotel
    if (routePoints.length > 1) {
      routePoints.push([itinerary.accommodation.coordinates.lat, itinerary.accommodation.coordinates.lng])

      // Create route line for current day only
      routeLineRef.current = L.polyline(routePoints, {
        color: "#3b82f6",
        weight: 3,
        opacity: 0.7,
        dashArray: "10, 10",
        lineCap: "round",
      }).addTo(mapInstanceRef.current)
    }

    // Fit map to show all markers
    if (markersRef.current.length > 0) {
      const group = new L.featureGroup([...markersRef.current, ...(routeLineRef.current ? [routeLineRef.current] : [])])
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))
    }
  }, [itinerary, selectedDay, selectedActivity, onActivitySelect])

  // Smooth pan to selected activity with zoom
  useEffect(() => {
    if (selectedActivity?.coordinates && mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedActivity.coordinates.lat, selectedActivity.coordinates.lng], 16, {
        animate: true,
        duration: 1,
      })
    }
  }, [selectedActivity])

  return (
    <div className="h-full flex flex-col">
      {/* Map Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Trip Overview - Viewing Day {selectedDay + 1}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Hotel</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Current Day</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-400 rounded-full opacity-60"></div>
            <span>Other Days</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-8 h-0.5 border-t-2 border-blue-500 border-dashed"></div>
            <span>Day Route</span>
          </div>
        </div>
        {selectedActivity && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm font-medium text-yellow-800">
              📍 {selectedActivity.title} - {selectedActivity.time}
            </div>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </div>
  )
}
