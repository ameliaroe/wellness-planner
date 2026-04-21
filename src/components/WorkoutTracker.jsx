import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { getWeekDates, formatDateKey, formatShortDay, isToday } from '../utils/dates'

const SLOTS = [
  { id: 'morning',   emoji: '🌅', label: 'Morning'   },
  { id: 'afternoon', emoji: '☀️',  label: 'Afternoon' },
  { id: 'evening',   emoji: '🌙', label: 'Evening'   },
]

export default function WorkoutTracker() {
  const [workouts, setWorkouts] = useLocalStorage('workouts', {})
  const [editing, setEditing] = useState(null) // { dateKey, slotId, field }
  const [editValue, setEditValue] = useState('')

  const weekDates = getWeekDates(new Date())

  const get = (dateKey, slotId, field) => workouts[dateKey]?.[slotId]?.[field] ?? ''

  const startEdit = (dateKey, slotId, field) => {
    setEditing({ dateKey, slotId, field })
    setEditValue(get(dateKey, slotId, field))
  }

  const saveEdit = () => {
    if (!editing) return
    const { dateKey, slotId, field } = editing
    setWorkouts((prev) => ({
      ...prev,
      [dateKey]: {
        ...(prev[dateKey] || {}),
        [slotId]: {
          ...(prev[dateKey]?.[slotId] || {}),
          [field]: editValue.trim(),
        },
      },
    }))
    setEditing(null)
  }

  const totalThisWeek = weekDates.reduce((acc, d) => {
    const dk = formatDateKey(d)
    const hasEntry = SLOTS.some((s) => get(dk, s.id, 'activity'))
    return acc + (hasEntry ? 1 : 0)
  }, 0)

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-700">Workout Tracker</h2>
          <p className="text-gray-400 text-sm mt-0.5">Log your movement for the week</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-coral-500">{totalThisWeek}</p>
          <p className="text-xs text-gray-400">active days this week</p>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[640px]" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
          {weekDates.map((date) => {
            const dateKey = formatDateKey(date)
            const today = isToday(date)
            return (
              <div
                key={dateKey}
                className={`bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col ${
                  today ? 'ring-2 ring-coral-300' : ''
                }`}
              >
                <div className={`py-2.5 text-center ${today ? 'bg-coral-50' : 'bg-cream-50'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider ${today ? 'text-coral-600' : 'text-gray-400'}`}>
                    {formatShortDay(date)}
                  </p>
                  <p className={`text-lg font-extrabold leading-tight ${today ? 'text-coral-700' : 'text-gray-600'}`}>
                    {date.getDate()}
                  </p>
                </div>

                <div className="p-2 space-y-2 flex-1">
                  {SLOTS.map(({ id, emoji, label }) => {
                    const activity = get(dateKey, id, 'activity')
                    const duration = get(dateKey, id, 'duration')
                    const isEditingActivity = editing?.dateKey === dateKey && editing?.slotId === id && editing?.field === 'activity'
                    const isEditingDuration = editing?.dateKey === dateKey && editing?.slotId === id && editing?.field === 'duration'

                    return (
                      <div key={id}>
                        <p className="text-[10px] font-semibold text-gray-400 mb-0.5">
                          {emoji} {label}
                        </p>

                        {/* Activity field */}
                        {isEditingActivity ? (
                          <input
                            autoFocus
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={saveEdit}
                            onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(null) }}
                            className="w-full text-xs border border-coral-300 rounded-lg px-2 py-1 outline-none mb-1"
                            placeholder="e.g. yoga, run, strength"
                          />
                        ) : (
                          <button
                            onClick={() => startEdit(dateKey, id, 'activity')}
                            className={`w-full text-left text-xs px-2 py-1 rounded-lg transition-colors leading-tight mb-1 ${
                              activity
                                ? 'text-gray-600 bg-cream-50 hover:bg-cream-100 font-medium'
                                : 'text-gray-300 border border-dashed border-gray-200 hover:border-coral-200 hover:text-coral-400'
                            }`}
                          >
                            {activity || 'Add…'}
                          </button>
                        )}

                        {/* Duration field — only show if activity exists or editing */}
                        {(activity || isEditingDuration) && (
                          isEditingDuration ? (
                            <input
                              autoFocus
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={saveEdit}
                              onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(null) }}
                              className="w-full text-xs border border-teal-300 rounded-lg px-2 py-1 outline-none"
                              placeholder="duration, e.g. 45 min"
                            />
                          ) : (
                            <button
                              onClick={() => startEdit(dateKey, id, 'duration')}
                              className={`w-full text-left text-[10px] px-2 py-0.5 rounded transition-colors ${
                                duration ? 'text-teal-500 font-semibold' : 'text-gray-300 hover:text-teal-400'
                              }`}
                            >
                              {duration || '+ duration'}
                            </button>
                          )
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
