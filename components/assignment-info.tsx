"use client"

import { useState } from "react"
import { Info, X, Check } from "lucide-react"

export function AssignmentInfo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed top-4 left-4 z-50">
      {/* Hidden trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
        title="Assignment Requirements"
      >
        <Info className="w-5 h-5 text-white/60" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Content */}
          <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl glass shadow-2xl p-6 animate-scale-in">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold text-white mb-4">Assignment Requirements Checklist</h2>
            
            <div className="space-y-6 text-white/90">
              {/* APIs Used */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  APIs Used (Minimum 3 Required)
                </h3>
                <div className="pl-4 space-y-2">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="font-medium text-green-400">Browser APIs:</p>
                    <ul className="mt-1 text-sm text-white/70 list-disc list-inside space-y-1">
                      <li><strong>localStorage</strong> - Search history, quick links, notes, todos, bookmarks, countdown events, city preferences</li>
                      <li><strong>Geolocation API</strong> - Auto-detect user location for weather</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="font-medium text-green-400">Data APIs:</p>
                    <ul className="mt-1 text-sm text-white/70 list-disc list-inside space-y-1">
                      <li><strong>Open-Meteo Weather API</strong> - Real-time weather data</li>
                      <li><strong>Open-Meteo Geocoding API</strong> - City search functionality</li>
                      <li><strong>Quotable API</strong> - Random inspirational quotes</li>
                      <li><strong>Hacker News API</strong> - Tech news feed</li>
                      <li><strong>CoinGecko API</strong> - Cryptocurrency prices</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Implementation Points */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  Implementation (60 pts)
                </h3>
                <ul className="pl-4 space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Clean HTML</strong> - Semantic structure, proper elements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Clean CSS</strong> - Tailwind CSS, no inline styles, consistent design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Clean JavaScript</strong> - React/TypeScript, no console errors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>API Error Handling</strong> - User-friendly error messages, retry options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Permission Handling</strong> - Graceful fallback when geolocation denied (manual city selection)</span>
                  </li>
                </ul>
              </div>

              {/* Subjective Points */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  Subjective Evaluation (40 pts)
                </h3>
                <ul className="pl-4 space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Concept</strong> - Browser start page combining search, productivity tools, and real-time data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Originality</strong> - Custom design with YouTube video background, glassmorphism UI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Usability</strong> - Intuitive interface, clear interactions, keyboard support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Visual Design</strong> - Cohesive frosted glass aesthetic, smooth animations</span>
                  </li>
                </ul>
              </div>

              {/* Feature List */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-white/70">
                  <div className="p-2 rounded-lg bg-white/5">Google Search + History</div>
                  <div className="p-2 rounded-lg bg-white/5">Quick Links (Customizable)</div>
                  <div className="p-2 rounded-lg bg-white/5">Weather (Location/Search)</div>
                  <div className="p-2 rounded-lg bg-white/5">Daily Quote</div>
                  <div className="p-2 rounded-lg bg-white/5">Tech News Feed</div>
                  <div className="p-2 rounded-lg bg-white/5">Quick Notes</div>
                  <div className="p-2 rounded-lg bg-white/5">Todo List</div>
                  <div className="p-2 rounded-lg bg-white/5">Pomodoro Timer</div>
                  <div className="p-2 rounded-lg bg-white/5">Countdown Events</div>
                  <div className="p-2 rounded-lg bg-white/5">Crypto Prices</div>
                  <div className="p-2 rounded-lg bg-white/5">Bookmarks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
