"use client"

import { useState, useEffect } from "react"
import { StickyNote, Save, Trash2 } from "lucide-react"

export function NoteCard() {
  const [note, setNote] = useState("")
  const [saved, setSaved] = useState(false)

  // Load note from localStorage (Browser API)
  useEffect(() => {
    const savedNote = localStorage.getItem("quickNote")
    if (savedNote) {
      setNote(savedNote)
    }
  }, [])

  const saveNote = () => {
    localStorage.setItem("quickNote", note)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const clearNote = () => {
    setNote("")
    localStorage.removeItem("quickNote")
  }

  return (
    <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl w-full animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-white/80" />
          <span className="text-sm font-medium text-white/80">Quick Note</span>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs text-green-400 animate-fade-in">Saved!</span>
          )}
          <button
            onClick={saveNote}
            className="text-white/60 hover:text-white transition-colors"
            title="Save note"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={clearNote}
            className="text-white/60 hover:text-red-400 transition-colors"
            title="Clear note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={saveNote}
        placeholder="Write something..."
        className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-white/40 resize-none focus:outline-none focus:border-white/30 transition-colors"
      />
    </div>
  )
}
