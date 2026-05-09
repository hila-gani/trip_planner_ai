export interface AgeGroup {
  id: string
  label: string
  emoji: string
  description: string
}

export interface TripStyle {
  id: string
  label: string
  emoji: string
  description: string
}

export interface TripDetails {
  destination: string
  startDate: Date
  endDate: Date
  totalPeople: number
  ageGroups: string[]
  tripStyles: string[]
  budget: number
  additionalRequests?: string
}

export interface Coordinates {
  lat: number
  lng: number
}

export interface Activity {
  time: string
  title: string
  description: string
  duration?: string
  location?: string
  coordinates?: Coordinates
}

export interface DayPlan {
  date: string
  title: string
  description: string
  activities: Activity[]
}

export interface Accommodation {
  name: string
  type: string
  description: string
  coordinates: Coordinates
}

export interface TripItinerary {
  destination: string
  startDate: string
  endDate: string
  totalDays: number
  totalPeople: number
  dailyBudget: number
  coordinates: Coordinates
  accommodation: Accommodation
  days: DayPlan[]
}
