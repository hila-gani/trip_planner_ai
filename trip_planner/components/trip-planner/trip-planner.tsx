"use client"

import { useState } from "react"
import StepForm from "./step-form"
import ItineraryView from "./itinerary-view"
import AdjustmentForm from "./adjustment-form"
import type { TripDetails, TripItinerary } from "@/lib/types"
import { generateItinerary } from "@/lib/trip-generator"

export default function TripPlanner() {
  const [step, setStep] = useState<"form" | "itinerary" | "adjustment">("form")
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null)
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit = async (details: TripDetails) => {
    setTripDetails(details)
    setIsLoading(true)

    try {
      const generatedItinerary = await generateItinerary(details)
      setItinerary(generatedItinerary)
      setStep("itinerary")
    } catch (error) {
      console.error("Error generating itinerary:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdjustment = async (adjustmentText: string) => {
    if (!tripDetails || !itinerary) return

    setIsLoading(true)

    try {
      const updatedItinerary = await generateItinerary({
        ...tripDetails,
        additionalRequests: adjustmentText,
      })
      console.log(updatedItinerary)
      console.log(updatedItinerary.accommodation)
      setItinerary(updatedItinerary)
    } catch (error) {
      console.error("Error updating itinerary:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetPlanner = () => {
    setTripDetails(null)
    setItinerary(null)
    setStep("form")
  }

  return (
    <div className="max-w-4xl mx-auto">
      {step === "form" && <StepForm onSubmit={handleFormSubmit} isLoading={isLoading} />}

      {step === "itinerary" && itinerary && (
        <ItineraryView
          itinerary={itinerary}
          isLoading={isLoading}
          onAdjustmentClick={() => setStep("adjustment")}
          onResetClick={resetPlanner}
        />
      )}

      {step === "adjustment" && (
        <AdjustmentForm onSubmit={handleAdjustment} onBack={() => setStep("itinerary")} isLoading={isLoading} />
      )}
    </div>
  )
}
