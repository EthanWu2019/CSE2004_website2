"use client"

import { Clock } from "@/components/clock"
import { SearchBar } from "@/components/search-bar"
import { QuickLinks } from "@/components/quick-links"
import { WeatherCard } from "@/components/weather-card"
import { QuoteCard } from "@/components/quote-card"
import { NewsCard } from "@/components/news-card"
import { NoteCard } from "@/components/note-card"
import { VideoBackground } from "@/components/video-background"
import { CountdownCard } from "@/components/countdown-card"
import { CryptoCard } from "@/components/crypto-card"
import { TodoCard } from "@/components/todo-card"
import { PomodoroCard } from "@/components/pomodoro-card"
import { BookmarkCard } from "@/components/bookmark-card"
import { AssignmentInfo } from "@/components/assignment-info"

export default function HomePage() {
  const handleSearch = (query: string) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`
    window.open(searchUrl, "_blank")
  }

  return (
    <div className="fixed inset-0 overflow-y-auto overflow-x-hidden">
      <VideoBackground />
      <AssignmentInfo />
      
      {/* First Section - Hero with Search (100vh) */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        {/* Clock - positioned at top, moved down a bit */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2">
          <Clock />
        </div>

        {/* Search Section - centered, quick links above search */}
        <div className="w-full flex flex-col items-center gap-6">
          <QuickLinks />
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Second Section - Utility Cards */}
      <section className="min-h-screen px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-light text-white/80 text-center mb-8 animate-fade-in">
            Widgets
          </h2>
          
          {/* Masonry-style layout using CSS columns */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">
            <div className="break-inside-avoid mb-4">
              <WeatherCard />
            </div>
            <div className="break-inside-avoid mb-4">
              <PomodoroCard />
            </div>
            <div className="break-inside-avoid mb-4">
              <QuoteCard />
            </div>
            <div className="break-inside-avoid mb-4">
              <CryptoCard />
            </div>
            <div className="break-inside-avoid mb-4">
              <TodoCard />
            </div>
            <div className="break-inside-avoid mb-4">
              <NewsCard />
            </div>
            <div className="break-inside-avoid mb-4">
              <CountdownCard />
            </div>
            <div className="break-inside-avoid mb-4">
              <NoteCard />
            </div>
            <div className="break-inside-avoid mb-4">
              <BookmarkCard />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-sm text-white/40">
            StartTab - Browser APIs Demo
          </p>
        </footer>
      </section>
    </div>
  )
}
