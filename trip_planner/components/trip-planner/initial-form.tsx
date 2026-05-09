"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { format } from "date-fns"
import { he } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"
import type { TripDetails } from "@/lib/types"

interface InitialFormProps {
  onSubmit: (details: TripDetails) => void
  isLoading: boolean
}

export default function InitialForm({ onSubmit, isLoading }: InitialFormProps) {
  const [destination, setDestination] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [budget, setBudget] = useState(3000)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!destination || !dateRange.from || !dateRange.to) {
      // כאן אפשר להוסיף הודעת שגיאה
      return
    }

    onSubmit({
      destination,
      startDate: dateRange.from,
      endDate: dateRange.to,
      adults,
      children,
      budget,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="destination">יעד הטיול</Label>
        <Input
          id="destination"
          placeholder="לאן תרצו לטייל?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          className="text-right"
        />
      </div>

      <div className="space-y-2">
        <Label>תאריכי הטיול</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between text-right">
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy", { locale: he })} -{" "}
                    {format(dateRange.to, "dd/MM/yyyy", { locale: he })}
                  </>
                ) : (
                  format(dateRange.from, "dd/MM/yyyy", { locale: he })
                )
              ) : (
                "בחרו תאריכים"
              )}
              <CalendarIcon className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              locale={he}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="adults">מבוגרים</Label>
          <Select value={adults.toString()} onValueChange={(value) => setAdults(Number.parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="מספר מבוגרים" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="children">ילדים</Label>
          <Select value={children.toString()} onValueChange={(value) => setChildren(Number.parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="מספר ילדים" />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <Label htmlFor="budget">תקציב (₪)</Label>
          <span className="font-medium">{budget.toLocaleString()}</span>
        </div>
        <Slider
          id="budget"
          min={1000}
          max={20000}
          step={500}
          value={[budget]}
          onValueChange={(value) => setBudget(value[0])}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>נמוך</span>
          <span>בינוני</span>
          <span>גבוה</span>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            מייצר את הטיול המושלם...
          </>
        ) : (
          "תכנן את הטיול שלי"
        )}
      </Button>
    </form>
  )
}
