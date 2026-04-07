"use client"

import { useState, useEffect } from "react"
import { Quote, RefreshCw, AlertCircle } from "lucide-react"

interface QuoteData {
  content: string
  author: string
}

type QuoteStatus = "loading" | "success" | "error"

export function QuoteCard() {
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [status, setStatus] = useState<QuoteStatus>("loading")

  const fetchQuote = async () => {
    setStatus("loading")
    try {
      const response = await fetch("https://api.quotable.io/random?maxLength=120")
      if (!response.ok) throw new Error("Failed to fetch quote")
      const data = await response.json()
      setQuote({ content: data.content, author: data.author })
      setStatus("success")
    } catch (error) {
      const fallbackQuotes: QuoteData[] = [
        { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { content: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
        { content: "Stay hungry, stay foolish.", author: "Steve Jobs" },
        { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { content: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
      ]
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
      setQuote(randomQuote)
      setStatus("success")
    }
  }

  useEffect(() => {
    fetchQuote()
  }, [])

  if (status === "loading") {
    return (
      <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl w-full animate-fade-in">
        <div className="flex items-center justify-center h-24">
          <RefreshCw className="w-6 h-6 text-white/60 animate-spin" />
        </div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl w-full animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <AlertCircle className="w-8 h-8 text-white/60" />
          <p className="text-sm text-white/60">Unable to load quote</p>
          <button
            onClick={fetchQuote}
            className="text-sm text-white/80 hover:text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl w-full animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <Quote className="w-5 h-5 text-white/60" />
        <button
          onClick={fetchQuote}
          className="text-white/50 hover:text-white transition-all hover:rotate-180 duration-500"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-white/90 leading-relaxed mb-3 text-balance">
        {quote.content}
      </p>
      
      <p className="text-sm text-white/60">
        — {quote.author}
      </p>
    </div>
  )
}
