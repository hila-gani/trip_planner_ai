"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import {
  CalendarIcon,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Users,
  CalendarIcon as CalendarIconLucide,
  DollarSign,
  Loader2,
  Sparkles,
  Heart,
} from "lucide-react"
import type { TripDetails, AgeGroup, TripStyle } from "@/lib/types"

interface StepFormProps {
  onSubmit: (details: TripDetails) => void
  isLoading: boolean
}

const steps = [
  { id: 1, title: "Destination", icon: MapPin, color: "from-purple-500 to-pink-500" },
  { id: 2, title: "Dates", icon: CalendarIconLucide, color: "from-blue-500 to-cyan-500" },
  { id: 3, title: "Group Size", icon: Users, color: "from-green-500 to-emerald-500" },
  { id: 4, title: "Age Groups", icon: Sparkles, color: "from-orange-500 to-red-500" },
  { id: 5, title: "Trip Style", icon: Heart, color: "from-pink-500 to-rose-500" },
  { id: 6, title: "Budget", icon: DollarSign, color: "from-indigo-500 to-purple-500" },
]

const ageGroups: AgeGroup[] = [
  { id: "adults", label: "Adults (18+)", emoji: "👨‍👩‍👧‍👦", description: "18 years and older" },
  { id: "teens", label: "Teens (13-17)", emoji: "🧑‍🎓", description: "13-17 years old" },
  { id: "children", label: "Children (3-12)", emoji: "👶", description: "3-12 years old" },
  { id: "toddlers", label: "Toddlers (0-2)", emoji: "🍼", description: "0-2 years old" },
  { id: "seniors", label: "Golden Age (60+)", emoji: "👴", description: "60 years and older" },
]

const tripStyles: TripStyle[] = [
  { id: "culture", label: "Culture & History", emoji: "🏛️", description: "Museums, monuments, historical sites" },
  { id: "adventure", label: "Adventure", emoji: "🏔️", description: "Hiking, extreme sports, outdoor activities" },
  { id: "relaxation", label: "Relaxation", emoji: "🏖️", description: "Beaches, spas, peaceful activities" },
  { id: "food", label: "Food & Dining", emoji: "🍽️", description: "Local cuisine, restaurants, food tours" },
  { id: "nightlife", label: "Nightlife", emoji: "🌃", description: "Bars, clubs, evening entertainment" },
  { id: "shopping", label: "Shopping", emoji: "🛍️", description: "Markets, malls, local crafts" },
  { id: "nature", label: "Nature", emoji: "🌿", description: "Parks, wildlife, natural landscapes" },
  { id: "family", label: "Family Fun", emoji: "👨‍👩‍👧‍👦", description: "Kid-friendly activities, theme parks" },
]

export default function StepForm({ onSubmit, isLoading }: StepFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [destination, setDestination] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [totalPeople, setTotalPeople] = useState(2)
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>(["adults"])
  const [selectedTripStyles, setSelectedTripStyles] = useState<string[]>(["culture"])
  const [budget, setBudget] = useState(3000)

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    if (!destination || !dateRange?.from || !dateRange?.to) return

    onSubmit({
      destination,
      startDate: dateRange.from,
      endDate: dateRange.to,
      totalPeople,
      ageGroups: selectedAgeGroups,
      tripStyles: selectedTripStyles,
      budget,
    })
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return destination.trim() !== ""
      case 2:
        return dateRange?.from && dateRange?.to
      case 3:
        return totalPeople > 0
      case 4:
        return selectedAgeGroups.length > 0
      case 5:
        return selectedTripStyles.length > 0
      case 6:
        return budget > 0
      default:
        return false
    }
  }

  const currentStepData = steps[currentStep - 1]

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Step {currentStep} of {steps.length}
          </CardTitle>
          <div className={`p-3 rounded-full bg-gradient-to-r ${currentStepData.color}`}>
            <currentStepData.icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          {steps.map((step, index) => (
            <span
              key={step.id}
              className={`${index + 1 <= currentStep ? "text-blue-600 font-medium" : "text-gray-400"}`}
            >
              {step.title}
            </span>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="min-h-[300px] flex flex-col justify-center">
          {/* Step 1: Destination */}
          {currentStep === 1 && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Where would you like to go?
                </h3>
                <p className="text-gray-600">Tell us your dream destination</p>
              </div>
              <div className="max-w-md mx-auto">
                <Input
                  placeholder="e.g., Paris, Tokyo, New York..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="text-center text-lg py-6 border-2 border-purple-200 focus:border-purple-500 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Step 2: Dates */}
          {currentStep === 2 && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  When are you traveling?
                </h3>
                <p className="text-gray-600">Select your travel dates</p>
              </div>
              <div className="max-w-md mx-auto">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-center text-lg py-6 border-2 border-blue-200 hover:border-blue-500 rounded-xl"
                    >
                      {dateRange?.from ? (
                        dateRange?.to ? (
                          <>
                            {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM dd, yyyy")
                        )
                      ) : (
                        "Pick your dates"
                      )}
                      <CalendarIcon className="ml-2 h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Step 3: Group Size */}
          {currentStep === 3 && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  How many people?
                </h3>
                <p className="text-gray-600">Total number of travelers</p>
              </div>
              <div className="max-w-md mx-auto space-y-6">
                <div className="text-6xl font-bold text-green-600">{totalPeople}</div>
                <Slider
                  value={[totalPeople]}
                  onValueChange={(value) => setTotalPeople(value[0])}
                  max={20}
                  min={1}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1 person</span>
                  <span>20+ people</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Age Groups */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Who's traveling?
                </h3>
                <p className="text-gray-600">Select all age groups in your party</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ageGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedAgeGroups.includes(group.id)
                        ? "border-orange-500 bg-orange-50 shadow-md"
                        : "border-gray-200 hover:border-orange-300 hover:bg-orange-25"
                    }`}
                    onClick={() => {
                      if (selectedAgeGroups.includes(group.id)) {
                        setSelectedAgeGroups(selectedAgeGroups.filter((id) => id !== group.id))
                      } else {
                        setSelectedAgeGroups([...selectedAgeGroups, group.id])
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedAgeGroups.includes(group.id)}
                        onChange={() => {}}
                        className="pointer-events-none"
                      />
                      <div className="text-2xl">{group.emoji}</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{group.label}</div>
                        <div className="text-sm text-gray-500">{group.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Trip Style */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  What's your travel style?
                </h3>
                <p className="text-gray-600">Select all that interest you</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tripStyles.map((style) => (
                  <div
                    key={style.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedTripStyles.includes(style.id)
                        ? "border-pink-500 bg-pink-50 shadow-md"
                        : "border-gray-200 hover:border-pink-300 hover:bg-pink-25"
                    }`}
                    onClick={() => {
                      if (selectedTripStyles.includes(style.id)) {
                        setSelectedTripStyles(selectedTripStyles.filter((id) => id !== style.id))
                      } else {
                        setSelectedTripStyles([...selectedTripStyles, style.id])
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedTripStyles.includes(style.id)}
                        onChange={() => {}}
                        className="pointer-events-none"
                      />
                      <div className="text-2xl">{style.emoji}</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{style.label}</div>
                        <div className="text-sm text-gray-500">{style.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Budget */}
          {currentStep === 6 && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  What's your budget?
                </h3>
                <p className="text-gray-600">Total budget for the entire trip</p>
              </div>
              <div className="max-w-md mx-auto space-y-6">
                <div className="text-5xl font-bold text-indigo-600">${budget.toLocaleString()}</div>
                <Slider
                  value={[budget]}
                  onValueChange={(value) => setBudget(value[0])}
                  max={20000}
                  min={500}
                  step={250}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Budget</span>
                  <span>Moderate</span>
                  <span>Luxury</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep === steps.length ? (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isLoading}
              className={`px-8 py-3 rounded-xl bg-gradient-to-r ${currentStepData.color} hover:opacity-90 text-white font-medium`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating your perfect trip...
                </>
              ) : (
                <>
                  Create My Trip
                  <Sparkles className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-6 py-3 rounded-xl bg-gradient-to-r ${currentStepData.color} hover:opacity-90 text-white font-medium`}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
