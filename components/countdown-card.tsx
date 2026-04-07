"use client"

import { useState, useEffect } from "react"
import { Calendar, Plus, X, Trash2 } from "lucide-react"

interface CountdownEvent {
  id: string
  name: string
  date: string
}

export function CountdownCard() {
  const [events, setEvents] = useState<CountdownEvent[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDate, setNewDate] = useState("")
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem("countdownEvents")
    if (saved) {
      try {
        setEvents(JSON.parse(saved))
      } catch {
        setEvents([])
      }
    }
  }, [])

  const saveEvents = (newEvents: CountdownEvent[]) => {
    setEvents(newEvents)
    localStorage.setItem("countdownEvents", JSON.stringify(newEvents))
  }

  const addEvent = () => {
    if (!newName.trim() || !newDate) return
    const event: CountdownEvent = {
      id: Date.now().toString(),
      name: newName.trim(),
      date: newDate,
    }
    saveEvents([...events, event])
    setNewName("")
    setNewDate("")
    setIsAdding(false)
  }

  const removeEvent = (id: string) => {
    saveEvents(events.filter(e => e.id !== id))
  }

  const getDaysUntil = (dateStr: string) => {
    if (!now) return 0
    const target = new Date(dateStr)
    const diff = target.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl w-full animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-white/80" />
          <span className="text-sm font-medium text-white/80">Countdown</span>
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
            placeholder="Event name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/30"
          />
          <button
            onClick={addEvent}
            className="w-full py-2 bg-white/20 rounded-lg text-sm text-white font-medium hover:bg-white/30 transition-colors"
          >
            Add
          </button>
        </div>
      )}

      {events.length === 0 ? (
        <p className="text-sm text-white/50 text-center py-2">No events yet</p>
      ) : (
        <div className="space-y-2">
          {events.map((event) => {
            const days = getDaysUntil(event.date)
            return (
              <div
                key={event.id}
                className="flex items-center justify-between p-2 bg-white/5 rounded-lg group"
              >
                <div>
                  <p className="text-sm text-white/90">{event.name}</p>
                  <p className={`text-xs ${days < 0 ? 'text-red-400' : days <= 7 ? 'text-yellow-400' : 'text-white/50'}`}>
                    {days < 0 ? `${Math.abs(days)} days ago` : days === 0 ? 'Today!' : `${days} days left`}
                  </p>
                </div>
                <button
                  onClick={() => removeEvent(event.id)}
                  className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
