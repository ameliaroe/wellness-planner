import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useLocalStorage from '../hooks/useLocalStorage'
import { formatDateKey, formatDisplayDate, addDays, isToday } from '../utils/dates'

const EMPTY_ENTRY = {
  grateful: ['', '', ''],
  priorities: ['', '', ''],
  affirmation: '',
  makeItGreat: '',
}

export default function Journal() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [entries, setEntries] = useLocalStorage('journalEntries5min', {})

  const dateKey = formatDateKey(currentDate)
  const entry = entries[dateKey] ?? EMPTY_ENTRY
  const todayFlag = isToday(currentDate)

  const update = (field, value) => {
    setEntries((prev) => ({
      ...prev,
      [dateKey]: { ...EMPTY_ENTRY, ...(prev[dateKey] || {}), [field]: value },
    }))
  }

  const updateList = (field, idx, value) => {
    const list = [...(entry[field] || ['', '', ''])]
    list[idx] = value
    update(field, list)
  }

  const navigate = (days) => {
    setCurrentDate((d) => {
      const next = addDays(d, days)
      return days > 0 && isToday(next) ? new Date() : next
    })
  }

  const totalEntries = Object.keys(entries).length

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-gray-700">Daily Journal</h2>
        <p className="text-gray-400 text-sm mt-0.5">Five minutes to set the tone for your day</p>
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
          {todayFlag && <span className="text-xs font-bold text-coral-400">Today</span>}
        </div>
        <button
          onClick={() => navigate(1)}
          disabled={!todayFlag ? false : true}
          className={`p-1.5 rounded-full transition-colors ${
            todayFlag ? 'text-gray-200 cursor-not-allowed' : 'hover:bg-cream-100 text-gray-400 hover:text-gray-600'
          }`}
        >
          <ChevronRight size={19} />
        </button>
      </div>

      <div className="space-y-4">

        {/* Gratitude */}
        <Section title="🌸 I am grateful for…" accent="coral">
          {[0, 1, 2].map((i) => (
            <NumberedInput
              key={i}
              num={i + 1}
              value={entry.grateful?.[i] ?? ''}
              onChange={(v) => updateList('grateful', i, v)}
              placeholder={['a person in my life', 'something small I noticed', 'an opportunity I have'][i]}
            />
          ))}
        </Section>

        {/* What would make today great */}
        <Section title="✨ What would make today great?" accent="teal">
          <textarea
            value={entry.makeItGreat ?? ''}
            onChange={(e) => update('makeItGreat', e.target.value)}
            placeholder="If today ended perfectly, what would have happened?"
            className="w-full h-24 resize-none outline-none text-sm text-gray-600 placeholder:text-gray-300 leading-relaxed"
          />
        </Section>

        {/* Top 3 priorities */}
        <Section title="🎯 My top 3 priorities today" accent="coral">
          {[0, 1, 2].map((i) => (
            <NumberedInput
              key={i}
              num={i + 1}
              value={entry.priorities?.[i] ?? ''}
              onChange={(v) => updateList('priorities', i, v)}
              placeholder={['most important task', 'second priority', 'third priority'][i]}
            />
          ))}
        </Section>

        {/* Daily affirmation */}
        <Section title="💛 Daily affirmation" accent="teal">
          <input
            type="text"
            value={entry.affirmation ?? ''}
            onChange={(e) => update('affirmation', e.target.value)}
            placeholder="I am…"
            className="w-full outline-none text-sm text-gray-600 placeholder:text-gray-300 font-medium"
          />
        </Section>

      </div>

      <p className="text-center text-xs text-gray-300 mt-5">
        ✓ Auto-saved · {totalEntries} {totalEntries === 1 ? 'entry' : 'entries'} total
      </p>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <p className="text-sm font-bold text-gray-600 mb-3">{title}</p>
      {children}
    </div>
  )
}

function NumberedInput({ num, value, onChange, placeholder }) {
  return (
    <div className="flex items-center gap-3 py-1.5 border-b border-cream-100 last:border-0">
      <span className="w-5 h-5 rounded-full bg-cream-200 text-gray-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
        {num}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 outline-none text-sm text-gray-600 placeholder:text-gray-300"
      />
    </div>
  )
}
