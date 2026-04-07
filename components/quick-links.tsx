"use client"

import { useState, useEffect } from "react"
import { Plus, X } from "lucide-react"

interface QuickLink {
  id: string
  name: string
  url: string
}

const defaultLinks: QuickLink[] = [
  { id: "1", name: "YouTube", url: "https://youtube.com" },
  { id: "2", name: "GitHub", url: "https://github.com" },
  { id: "3", name: "Twitter", url: "https://twitter.com" },
  { id: "4", name: "Reddit", url: "https://reddit.com" },
  { id: "5", name: "Gmail", url: "https://mail.google.com" },
  { id: "6", name: "Drive", url: "https://drive.google.com" },
]

export function QuickLinks() {
  const [links, setLinks] = useState<QuickLink[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState("")
  const [newUrl, setNewUrl] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("quickLinks")
    if (saved) {
      try {
        setLinks(JSON.parse(saved))
      } catch {
        setLinks(defaultLinks)
      }
    } else {
      setLinks(defaultLinks)
      localStorage.setItem("quickLinks", JSON.stringify(defaultLinks))
    }
  }, [])

  const saveLinks = (newLinks: QuickLink[]) => {
    setLinks(newLinks)
    localStorage.setItem("quickLinks", JSON.stringify(newLinks))
  }

  const addLink = () => {
    if (!newName.trim() || !newUrl.trim()) return
    let url = newUrl.trim()
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url
    }
    const newLink: QuickLink = {
      id: Date.now().toString(),
      name: newName.trim(),
      url,
    }
    saveLinks([...links, newLink])
    setNewName("")
    setNewUrl("")
    setIsAdding(false)
  }

  const removeLink = (id: string) => {
    saveLinks(links.filter(link => link.id !== id))
  }

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    } catch {
      return null
    }
  }

  const getInitials = (name: string) => name.charAt(0).toUpperCase()

  return (
    <div className="w-full max-w-3xl animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="flex flex-wrap justify-center gap-3">
        {links.map((link, index) => (
          <div 
            key={link.id} 
            className="group relative animate-scale-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl glass-light hover:bg-[rgba(40,40,50,0.75)] hover:border-white/20 hover:scale-105 transition-all duration-300 shadow-xl"
            >
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center overflow-hidden">
                {getFaviconUrl(link.url) ? (
                  <img
                    src={getFaviconUrl(link.url) || ""}
                    alt={link.name}
                    className="w-5 h-5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                ) : (
                  <span className="text-sm font-medium text-white">
                    {getInitials(link.name)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-white/70 text-center w-12 truncate">
                {link.name}
              </span>
            </a>
            <button
              onClick={() => removeLink(link.id)}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}

        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl backdrop-blur-xl bg-[rgba(30,30,40,0.4)] border border-dashed border-white/15 hover:bg-[rgba(30,30,40,0.6)] hover:border-white/30 transition-all duration-300 animate-scale-in"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white/50" />
            </div>
            <span className="text-[10px] text-white/50">Add</span>
          </button>
        ) : (
          <div className="flex flex-col gap-2 p-3 rounded-xl glass animate-scale-in">
            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
              autoFocus
            />
            <input
              type="text"
              placeholder="URL"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addLink()}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
            />
            <div className="flex gap-2">
              <button
                onClick={addLink}
                className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsAdding(false)
                  setNewName("")
                  setNewUrl("")
                }}
                className="px-3 py-2 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/15 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
