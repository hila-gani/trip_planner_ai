'use client'

import { ThemeProvider } from "@/components/theme-provider"
import { ReactNode } from "react"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function BodyWrapper({ children }: { children: ReactNode }) {
  return (
    <body className={inter.className}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </body>
  )
}
