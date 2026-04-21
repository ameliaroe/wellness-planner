import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { getWeekDates, formatDateKey, formatShortDay, isToday } from '../utils/dates'

const MEALS = [
  { id: 'breakfast', emoji: '🌅', label: 'Breakfast' },
  { id: 'snacks',    emoji: '🍎', label: 'Snacks'    },
  { id: 'lunch',     emoji: '☀️',  label: 'Lunch'     },
  { id: 'dinner',    emoji: '🌙', label: 'Dinner'    },
]

export default function MealPlanner() {
  const [meals, setMeals] = useLocalStorage('meals', {})
  const [editing, setEditing] = useState(null)
  const [editValue, setEditValue] = useState('')

  const weekDates = getWeekDates(new Date())

  const get = (dateKey, mealId) => meals[dateKey]?.[mealId] ?? ''

  const startEdit = (dateKey, mealId) => {
    setEditing({ dateKey, mealId })
    setEditValue(get(dateKey, mealId))
  }

  const saveEdit = () => {
    if (!editing) return
    setMeals((prev) => ({
      ...prev,
      [editing.dateKey]: { ...(prev[editing.dateKey] || {}), [editing.mealId]: editValue.trim() },
    }))
    setEditing(null)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-700">Meal Planner</h2>
        <p className="text-gray-400 text-sm mt-0.5">Plan your week for mindful, nourishing eating</p>
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
                  today ? 'ring-2 ring-teal-300' : ''
                }`}
              >
                <div className={`py-2.5 text-center ${today ? 'bg-teal-50' : 'bg-cream-50'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider ${today ? 'text-teal-600' : 'text-gray-400'}`}>
                    {formatShortDay(date)}
                  </p>
                  <p className={`text-lg font-extrabold leading-tight ${today ? 'text-teal-700' : 'text-gray-600'}`}>
                    {date.getDate()}
                  </p>
                </div>

                <div className="p-2 space-y-1.5 flex-1">
                  {MEALS.map(({ id, emoji, label }) => {
                    const value = get(dateKey, id)
                    const isActive = editing?.dateKey === dateKey && editing?.mealId === id
                    return (
                      <div key={id}>
                        <p className="text-[10px] font-semibold text-gray-400 mb-0.5">
                          {emoji} {label}
                        </p>
                        {isActive ? (
                          <input
                            autoFocus
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={saveEdit}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit()
                              if (e.key === 'Escape') setEditing(null)
                            }}
                            className="w-full text-xs border border-coral-300 rounded-lg px-2 py-1.5 outline-none"
                            placeholder="Add…"
                          />
                        ) : (
                          <button
                            onClick={() => startEdit(dateKey, id)}
                            className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors leading-tight ${
                              value
                                ? 'text-gray-600 bg-cream-50 hover:bg-cream-100'
                                : 'text-gray-300 border border-dashed border-gray-200 hover:border-coral-200 hover:text-coral-400'
                            }`}
                          >
                            {value || 'Add…'}
                          </button>
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
