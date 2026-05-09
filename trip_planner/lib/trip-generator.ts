import type { TripDetails, TripItinerary } from "./types"
import { addDays, format } from "date-fns"

// trip-generator.ts

import type { TripDetails, TripItinerary } from "@/lib/types"

export async function generateItinerary(details: TripDetails): Promise<TripItinerary> {
  const response = await fetch("http://localhost:5000/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to generate itinerary: ${error}`)
  }
  const response_json = response.json()
  console.log(response_json)
  console.log(response_json.accommodation)
  return response_json
}
