"use client"

import { useState, useEffect } from "react"

export function Clock() {
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(new Date())
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!time) {
    return (
      <div className="text-center animate-pulse">
        <div className="text-5xl md:text-6xl font-light text-white tracking-tight">
          --:--
        </div>
      </div>
    )
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="text-center animate-fade-in">
      <div className="text-5xl md:text-6xl font-light text-white tracking-tight drop-shadow-lg">
        {formatTime(time)}
      </div>
      <div className="text-base md:text-lg text-white/70 mt-1 drop-shadow-md">
        {formatDate(time)}
      </div>
    </div>
  )
}
