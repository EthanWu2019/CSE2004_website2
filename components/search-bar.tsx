"use client"

import { useState, useEffect, useRef, FormEvent, KeyboardEvent } from "react"
import { Search, X, Clock } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("searchHistory")
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch {
        setHistory([])
      }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowHistory(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const saveToHistory = (searchQuery: string) => {
    const trimmed = searchQuery.trim()
    if (!trimmed) return
    const newHistory = [trimmed, ...history.filter(h => h !== trimmed)].slice(0, 10)
    setHistory(newHistory)
    localStorage.setItem("searchHistory", JSON.stringify(newHistory))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      saveToHistory(query)
      onSearch(query)
    }
  }

  const handleHistoryClick = (item: string) => {
    setQuery(item)
    saveToHistory(item)
    onSearch(item)
    setShowHistory(false)
  }

  const handleDeleteHistory = (item: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newHistory = history.filter(h => h !== item)
    setHistory(newHistory)
    localStorage.setItem("searchHistory", JSON.stringify(newHistory))
  }

  const clearAllHistory = () => {
    setHistory([])
    localStorage.removeItem("searchHistory")
    setShowHistory(false)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!showHistory || history.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex(prev => (prev < history.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : history.length - 1))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      handleHistoryClick(history[selectedIndex])
    } else if (e.key === "Escape") {
      setShowHistory(false)
      setSelectedIndex(-1)
    }
  }

  const filteredHistory = query
    ? history.filter(h => h.toLowerCase().includes(query.toLowerCase()))
    : history

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl animate-fade-in">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center group">
          <Search className="absolute left-5 h-5 w-5 text-white/50 group-focus-within:text-white/80 transition-colors" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search Google..."
            className="w-full rounded-full glass px-14 py-4 text-white placeholder:text-white/50 focus:bg-[rgba(40,40,50,0.8)] focus:border-white/25 focus:outline-none transition-all duration-300 shadow-xl hover:shadow-2xl hover:bg-[rgba(40,40,50,0.8)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-5 text-white/50 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {showHistory && filteredHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl glass shadow-xl overflow-hidden z-50 animate-slide-up">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
            <span className="text-sm text-white/60">Search History</span>
            <button
              onClick={clearAllHistory}
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Clear All
            </button>
          </div>
          <ul>
            {filteredHistory.map((item, index) => (
              <li
                key={item}
                onClick={() => handleHistoryClick(item)}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200 ${
                  selectedIndex === index ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-white/50" />
                  <span className="text-white/90">{item}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteHistory(item, e)}
                  className="text-white/40 hover:text-red-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
