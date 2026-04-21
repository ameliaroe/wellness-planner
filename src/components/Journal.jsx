import { useState } from 'react'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import useLocalStorage from '../hooks/useLocalStorage'
import { formatDateKey, formatDisplayDate, addDays, isToday } from '../utils/dates'

const PROMPTS = [
  'What are you grateful for today?',
  'What intention are you setting for today?',
  'How are you feeling right now?',
  'What would make today a great day?',
  'What did you learn or appreciate recently?',
]

export default function Journal() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [entries, setEntries] = useLocalStorage('journalEntries', {})
  const [promptIdx, setPromptIdx] = useState(() => Math.floor(Math.random() * PROMPTS.length))

  const dateKey = formatDateKey(currentDate)
  const entry = entries[dateKey] ?? ''
  const todayFlag = isToday(currentDate)

  const updateEntry = (text) => {
    setEntries((prev) => ({ ...prev, [dateKey]: text }))
  }

  const navigate = (days) => {
    setCurrentDate((d) => {
      const next = addDays(d, days)
      if (days > 0 && isToday(next)) return new Date()
      return next
    })
  }

  const canGoForward = !isToday(currentDate)
  const totalEntries = Object.values(entries).filter(Boolean).length

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-700">Daily Journal</h2>
        <p className="text-gray-400 text-sm mt-0.5">
          Capture your thoughts, reflections, and intentions
        </p>
      </div>

      {/* Date navigation */}
      <div className="flex items-center gap-3 mb-5 bg-white rounded-2xl px-4 py-3 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full hover:bg-cream-100 transition-colors text-gray-400 hover:text-gray-600"
        >
          <ChevronLeft size={19} />
        </button>
        <div className="flex-1 text-center">
          <p className="font-semibold text-gray-700 text-sm">{formatDisplayDate(currentDate)}</p>
          {todayFlag && (
            <span className="text-xs font-semibold text-sage-500">Today</span>
          )}
        </div>
        <button
          onClick={() => navigate(1)}
          disabled={!canGoForward}
          className={`p-1.5 rounded-full transition-colors ${
            canGoForward
              ? 'hover:bg-cream-100 text-gray-400 hover:text-gray-600'
              : 'text-gray-200 cursor-not-allowed'
          }`}
        >
          <ChevronRight size={19} />
        </button>
      </div>

      {/* Writing area */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* Prompt */}
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm text-gray-400 italic flex-1 pr-4">{PROMPTS[promptIdx]}</p>
          <button
            onClick={() => setPromptIdx((i) => (i + 1) % PROMPTS.length)}
            className="flex items-center gap-1 text-xs text-sage-400 hover:text-sage-600 transition-colors flex-shrink-0"
          >
            <Sparkles size={13} />
            New prompt
          </button>
        </div>

        <textarea
          value={entry}
          onChange={(e) => updateEntry(e.target.value)}
          placeholder="Write freely here… your thoughts are safe and only yours."
          className="w-full h-56 md:h-72 resize-none outline-none text-gray-600 text-sm leading-relaxed placeholder:text-gray-300"
        />

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-cream-100">
          <span className="text-xs text-gray-300">
            {entry.split(/\s+/).filter(Boolean).length} words
          </span>
          <span className="text-xs text-sage-400 font-medium">✓ Auto-saved</span>
        </div>
      </div>

      {totalEntries > 0 && (
        <p className="text-center text-xs text-gray-300 mt-4">
          ✨ You have {totalEntries} journal {totalEntries === 1 ? 'entry' : 'entries'}
        </p>
      )}
    </div>
  )
}
