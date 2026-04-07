"use client"

import { useState, useEffect } from "react"
import { Newspaper, RefreshCw, ExternalLink, AlertCircle } from "lucide-react"

interface NewsItem {
  title: string
  url: string
  source: string
}

type NewsStatus = "loading" | "success" | "error"

export function NewsCard() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [status, setStatus] = useState<NewsStatus>("loading")

  const fetchNews = async () => {
    setStatus("loading")
    try {
      // Using Hacker News API (free, no API key required)
      const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
      if (!response.ok) throw new Error("Failed to fetch news")
      
      const storyIds = await response.json()
      const topIds = storyIds.slice(0, 5)
      
      const stories = await Promise.all(
        topIds.map(async (id: number) => {
          const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          return storyRes.json()
        })
      )
      
      setNews(stories.map((story: { title: string; url?: string; id: number }) => ({
        title: story.title,
        url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        source: "Hacker News"
      })))
      setStatus("success")
    } catch (error) {
      setStatus("error")
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  if (status === "loading") {
    return (
      <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl w-full animate-fade-in">
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="w-6 h-6 text-white/60 animate-spin" />
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl w-full animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <AlertCircle className="w-8 h-8 text-white/60" />
          <p className="text-sm text-white/60">Unable to load news</p>
          <button
            onClick={fetchNews}
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-white/80" />
          <span className="text-sm font-medium text-white/80">Tech News</span>
        </div>
        <button
          onClick={fetchNews}
          className="text-white/60 hover:text-white transition-all hover:rotate-180 duration-500"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      <ul className="space-y-3">
        {news.map((item, index) => (
          <li 
            key={index} 
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2 text-sm text-white/90 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3 h-3 mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="line-clamp-2 leading-relaxed">{item.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
