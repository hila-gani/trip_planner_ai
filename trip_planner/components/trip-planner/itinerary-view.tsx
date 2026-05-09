"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, MapPin, RefreshCw, Pencil, Bed, Utensils, Users } from "lucide-react"
import type { TripItinerary, DayPlan, Activity } from "@/lib/types"
import InteractiveMapView from "./interactive-map-view"
import MapView from "@/components/trip-planner/map-view"

interface ItineraryViewProps {
  itinerary: TripItinerary
  isLoading: boolean
  onAdjustmentClick: () => void
  onResetClick: () => void
}

export default function ItineraryView({ itinerary, isLoading, onAdjustmentClick, onResetClick }: ItineraryViewProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [selectedDay, setSelectedDay] = useState<number>(0)

  const handleDayChange = (dayIndex: number) => {
    setSelectedDay(dayIndex)
    setSelectedActivity(null) // Reset selected activity when changing days
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-3xl font-bold">Your Trip to {itinerary.destination}</CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              {itinerary.startDate} - {itinerary.endDate} • {itinerary.totalDays} days
            </CardDescription>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={onAdjustmentClick} disabled={isLoading} className="rounded-xl">
              <Pencil className="mr-2 h-4 w-4" />
              Customize
            </Button>
            <Button
              variant="outline"
              onClick={onResetClick}
              disabled={isLoading}
              className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Summary Cards */}
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center text-blue-700">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-800">{itinerary.totalDays} days</p>
                <p className="text-blue-600 text-sm">
                  {itinerary.startDate} - {itinerary.endDate}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center text-green-700">
                  <Bed className="mr-2 h-5 w-5" />
                  Accommodation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold text-green-800">{itinerary.accommodation.name}</p>
                <p className="text-green-600 text-sm">{itinerary.accommodation.type}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center text-purple-700">
                  <Utensils className="mr-2 h-5 w-5" />
                  Daily Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-800">${itinerary.dailyBudget}</p>
                <p className="text-purple-600 text-sm">per person</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center text-orange-700">
                  <Users className="mr-2 h-5 w-5" />
                  Group Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-800">{itinerary.totalPeople}</p>
                <p className="text-orange-600 text-sm">travelers</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content - Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 h-[800px]">
          {/* Left Side - Itinerary */}
          <div className="p-6 overflow-y-auto border-r border-gray-200">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 sticky top-0 bg-white/90 backdrop-blur-sm py-2 z-10">
                Daily Itinerary
              </h3>

              {/* Day Selector */}
              <div className="flex flex-wrap gap-2 sticky top-16 bg-white/90 backdrop-blur-sm py-2 z-10">
                {itinerary.days.map((_, index) => (
                  <Button
                    key={index}
                    variant={selectedDay === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDayChange(index)}
                    className="rounded-full"
                  >
                    Day {index + 1}
                  </Button>
                ))}
              </div>

              {/* Selected Day Content Only */}
              <DayCard
                day={itinerary.days[selectedDay]}
                dayNumber={selectedDay + 1}
                onActivityClick={setSelectedActivity}
                selectedActivity={selectedActivity}
              />
            </div>
          </div>

          {/* Right Side - Interactive Map */}
          <div className="bg-gray-100">
            <MapView itinerary={itinerary} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DayCard({
  day,
  dayNumber,
  onActivityClick,
  selectedActivity,
}: {
  day: DayPlan
  dayNumber: number
  onActivityClick: (activity: Activity) => void
  selectedActivity: Activity | null
}) {
  const gradients = [
    "from-red-400 to-pink-400",
    "from-blue-400 to-cyan-400",
    "from-green-400 to-emerald-400",
    "from-purple-400 to-indigo-400",
    "from-orange-400 to-yellow-400",
    "from-teal-400 to-blue-400",
    "from-pink-400 to-rose-400",
  ]

  const gradient = gradients[dayNumber % gradients.length]

  return (
    <Card className="overflow-hidden shadow-lg border-0">
      <CardHeader className={`bg-gradient-to-r ${gradient} text-white`}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">
            Day {dayNumber}: {day.title}
          </CardTitle>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {day.date}
          </Badge>
        </div>
        <CardDescription className="text-white/90 text-base">{day.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ul className="space-y-4">
          {day.activities.map((activity, index) => (
            <li
              key={index}
              className={`border-l-4 pl-4 cursor-pointer transition-all duration-200 hover:bg-blue-50 rounded-r-lg p-3 ${
                selectedActivity === activity
                  ? "border-yellow-500 bg-yellow-50 shadow-md ring-2 ring-yellow-200"
                  : "border-blue-200 hover:border-blue-400"
              }`}
              onClick={() => onActivityClick(activity)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div
                      className={`flex items-center justify-center w-6 h-6 ${
                        selectedActivity === activity ? "bg-yellow-500" : "bg-blue-500"
                      } text-white rounded-full mr-2 transition-colors duration-200`}
                    >
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    <Clock className="mr-2 h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-600">{activity.time}</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 text-lg mb-1">{activity.title}</h4>
                  <p className="text-gray-600 mb-2">{activity.description}</p>

                  {activity.location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-1 h-3 w-3" />
                      {activity.location}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  {activity.duration && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {activity.duration}
                    </Badge>
                  )}
                  {activity.coordinates && <div className="text-xs text-gray-400">📍 On map</div>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
