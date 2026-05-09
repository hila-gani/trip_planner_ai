"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Lightbulb } from "lucide-react"

interface AdjustmentFormProps {
  onSubmit: (adjustmentText: string) => void
  onBack: () => void
  isLoading: boolean
}

export default function AdjustmentForm({ onSubmit, onBack, isLoading }: AdjustmentFormProps) {
  const [adjustmentText, setAdjustmentText] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (adjustmentText.trim()) {
      onSubmit(adjustmentText)
    }
  }

  const suggestions = [
    "Add more outdoor activities and nature experiences",
    "Include more cultural sites and museums",
    "Focus on local food experiences and restaurants",
    "Add shopping time and local markets",
    "Include more relaxation and spa time",
    "Add adventure activities like hiking or water sports",
  ]

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={isLoading}
          className="mb-4 text-white hover:bg-white/20 w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Itinerary
        </Button>

        <CardTitle className="text-3xl font-bold">Customize Your Trip</CardTitle>
        <p className="text-green-100 text-lg">
          Tell us how you'd like to adjust your itinerary. Be as specific as you want!
        </p>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="For example: I'd like to add more museums, spend more time at the beach, change the hotel to something closer to downtown, add vegetarian restaurant options..."
              value={adjustmentText}
              onChange={(e) => setAdjustmentText(e.target.value)}
              rows={6}
              className="resize-none border-2 border-gray-200 focus:border-green-500 rounded-xl"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading || !adjustmentText.trim()}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:opacity-90 rounded-xl px-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating your trip...
                </>
              ) : (
                "Update My Trip"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onBack} disabled={isLoading} className="rounded-xl">
              Cancel
            </Button>
          </div>
        </form>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center text-blue-700">
              <Lightbulb className="mr-2 h-5 w-5" />
              Suggestion Ideas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setAdjustmentText(suggestion)}
                  className="text-left p-3 rounded-lg bg-white/60 hover:bg-white/80 border border-blue-200 hover:border-blue-300 transition-all text-sm text-blue-700 hover:text-blue-800"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
