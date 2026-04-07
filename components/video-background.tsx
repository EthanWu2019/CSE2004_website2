"use client"

import { useState, useEffect } from "react"

export function VideoBackground() {
  const [mounted, setMounted] = useState(false)
  const videoId = "OO2kPK5-qno"
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* YouTube iframe with autoplay, mute, loop - only render on client */}
      {mounted && (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
          className="absolute top-1/2 left-1/2 w-[180vw] h-[180vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ minWidth: '180vw', minHeight: '180vh' }}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Background Video"
        />
      )}
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  )
}
