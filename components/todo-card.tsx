"use client"

import { useState, useEffect } from "react"
import { CheckSquare, Square, Plus, X } from "lucide-react"

interface TodoItem {
  id: string
  text: string
  done: boolean
}

export function TodoCard() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodo, setNewTodo] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("todos")
    if (saved) {
      try {
        setTodos(JSON.parse(saved))
      } catch {
        setTodos([])
      }
    }
  }, [])

  const saveTodos = (newTodos: TodoItem[]) => {
    setTodos(newTodos)
    localStorage.setItem("todos", JSON.stringify(newTodos))
  }

  const addTodo = () => {
    if (!newTodo.trim()) return
    const todo: TodoItem = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      done: false,
    }
    saveTodos([...todos, todo])
    setNewTodo("")
  }

  const toggleTodo = (id: string) => {
    saveTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const removeTodo = (id: string) => {
    saveTodos(todos.filter(t => t.id !== id))
  }

  return (
    <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl w-full animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <CheckSquare className="w-5 h-5 text-white/80" />
        <span className="text-sm font-medium text-white/80">To-Do</span>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Add task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          className="flex-1 px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
        />
        <button
          onClick={addTodo}
          className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {todos.length === 0 ? (
        <p className="text-sm text-white/50 text-center py-2">No tasks yet</p>
      ) : (
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-2 p-2 bg-white/5 rounded-lg group"
            >
              <button onClick={() => toggleTodo(todo.id)} className="text-white/70 hover:text-white">
                {todo.done ? (
                  <CheckSquare className="w-4 h-4 text-green-400" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
              <span className={`flex-1 text-sm ${todo.done ? 'text-white/40 line-through' : 'text-white/90'}`}>
                {todo.text}
              </span>
              <button
                onClick={() => removeTodo(todo.id)}
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
