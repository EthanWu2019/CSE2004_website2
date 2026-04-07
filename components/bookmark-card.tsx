"use client"

import { useState, useEffect } from "react"
import { Bookmark, Plus, X, ExternalLink } from "lucide-react"

interface BookmarkItem {
  id: string
  title: string
  url: string
}

export function BookmarkCard() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newUrl, setNewUrl] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("bookmarks")
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved))
      } catch {
        setBookmarks([])
      }
    }
  }, [])

  const saveBookmarks = (newBookmarks: BookmarkItem[]) => {
    setBookmarks(newBookmarks)
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks))
  }

  const addBookmark = () => {
    if (!newTitle.trim() || !newUrl.trim()) return
    let url = newUrl.trim()
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url
    }
    const bookmark: BookmarkItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      url,
    }
    saveBookmarks([...bookmarks, bookmark])
    setNewTitle("")
    setNewUrl("")
    setIsAdding(false)
  }

  const removeBookmark = (id: string) => {
    saveBookmarks(bookmarks.filter(b => b.id !== id))
  }

  return (
    <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl w-full animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-white/80" />
          <span className="text-sm font-medium text-white/80">Bookmarks</span>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-white/60 hover:text-white transition-colors"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {isAdding && (
        <div className="mb-3 space-y-2 animate-slide-up">
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
          />
          <input
            type="text"
            placeholder="URL"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addBookmark()}
            className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
          />
          <button
            onClick={addBookmark}
            className="w-full py-2 bg-white/20 rounded-lg text-sm text-white font-medium hover:bg-white/30 transition-colors"
          >
            Add
          </button>
        </div>
      )}

      {bookmarks.length === 0 ? (
        <p className="text-sm text-white/50 text-center py-2">No bookmarks yet</p>
      ) : (
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex items-center gap-2 p-2 bg-white/5 rounded-lg group"
            >
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
              >
                <ExternalLink className="w-3 h-3 opacity-60" />
                <span className="truncate">{bookmark.title}</span>
              </a>
              <button
                onClick={() => removeBookmark(bookmark.id)}
                className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
