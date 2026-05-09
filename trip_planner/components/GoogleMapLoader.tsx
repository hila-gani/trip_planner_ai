"use client"
import Script from "next/script"

export default function GoogleMapLoader() {
  return (
    <Script
      src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
      strategy="afterInteractive"
    />
  )
}
