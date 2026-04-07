"use client"

import { useState, useEffect, useRef } from "react"
import { Timer, Play, Pause, RotateCcw } from "lucide-react"

export function PomodoroCard() {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // Timer finished
      setIsRunning(false)
      if (!isBreak) {
        // Switch to break
        setIsBreak(true)
        setTimeLeft(5 * 60) // 5 minute break
      } else {
        // Switch back to work
        setIsBreak(false)
        setTimeLeft(25 * 60)
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, timeLeft, isBreak])

  const toggleTimer = () => setIsRunning(!isRunning)

  const resetTimer = () => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(25 * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = isBreak
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
    : ((25 * 60 - timeLeft) / (25 * 60)) * 100

  return (
    <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl w-full animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-white/80" />
          <span className="text-sm font-medium text-white/80">Pomodoro</span>
        </div>
      </div>

      <div className="text-center mb-3">
        <p className={`text-xs mb-2 ${isBreak ? 'text-green-400' : 'text-white/60'}`}>
          {isBreak ? 'Break Time' : 'Focus Time'}
        </p>
        <div className="text-3xl font-light text-white tracking-wider">
          {formatTime(timeLeft)}
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${isBreak ? 'bg-green-400' : 'bg-white/60'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={toggleTimer}
          className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={resetTimer}
          className="p-2 bg-white/10 rounded-lg text-white/70 hover:bg-white/20 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
