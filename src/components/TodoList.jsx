import { useState } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import useLocalStorage from '../hooks/useLocalStorage'

export default function TodoList() {
  const [todos, setTodos] = useLocalStorage('todos', [])
  const [input, setInput] = useState('')

  const add = () => {
    if (!input.trim()) return
    setTodos((prev) => [
      ...prev,
      { id: Date.now().toString(), text: input.trim(), completed: false },
    ])
    setInput('')
  }

  const toggle = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))

  const remove = (id) => setTodos((prev) => prev.filter((t) => t.id !== id))

  const clearCompleted = () => setTodos((prev) => prev.filter((t) => !t.completed))

  const active = todos.filter((t) => !t.completed)
  const done = todos.filter((t) => t.completed)

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-700">Tasks</h2>
        <p className="text-gray-400 text-sm mt-0.5">
          {active.length === 0 && todos.length > 0 ? 'All done! 🎉' : `${active.length} task${active.length !== 1 ? 's' : ''} to do`}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-5 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Add a new task…"
          className="flex-1 text-sm text-gray-600 outline-none placeholder:text-gray-300"
        />
        <button
          onClick={add}
          disabled={!input.trim()}
          className="bg-coral-500 text-white p-2 rounded-xl hover:bg-coral-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={17} />
        </button>
      </div>

      {active.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          {active.map((todo, i) => (
            <div key={todo.id} className={`flex items-center gap-3 px-5 py-3.5 group ${i < active.length - 1 ? 'border-b border-cream-100' : ''}`}>
              <button
                onClick={() => toggle(todo.id)}
                className="w-5 h-5 rounded-full border-2 border-coral-300 hover:border-coral-500 flex-shrink-0 flex items-center justify-center hover:bg-coral-50 transition-all"
              />
              <span className="flex-1 text-sm text-gray-600">{todo.text}</span>
              <button onClick={() => remove(todo.id)} className="text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {done.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed</p>
            <button onClick={clearCompleted} className="text-xs text-gray-300 hover:text-red-400 transition-colors">
              Clear all
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden opacity-60">
            {done.map((todo, i) => (
              <div key={todo.id} className={`flex items-center gap-3 px-5 py-3.5 group ${i < done.length - 1 ? 'border-b border-cream-100' : ''}`}>
                <button
                  onClick={() => toggle(todo.id)}
                  className="w-5 h-5 rounded-full bg-coral-400 flex-shrink-0 flex items-center justify-center hover:bg-coral-300 transition-colors"
                >
                  <Check size={11} className="text-white" />
                </button>
                <span className="flex-1 text-sm text-gray-400 line-through">{todo.text}</span>
                <button onClick={() => remove(todo.id)} className="text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {todos.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-14 text-center">
          <div className="text-5xl mb-3">✅</div>
          <p className="font-semibold text-gray-500">All clear!</p>
          <p className="text-gray-400 text-sm mt-1">Add a task above to get started</p>
        </div>
      )}
    </div>
  )
}
