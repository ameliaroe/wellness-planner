import { useState } from 'react'
import { Plus, X, Check, Pencil } from 'lucide-react'
import useLocalStorage from '../hooks/useLocalStorage'
import { formatDateKey, getWeekDates, formatShortDay, isToday } from '../utils/dates'

const PALETTE = [
  { bg: 'bg-coral-300'  },
  { bg: 'bg-orange-300' },
  { bg: 'bg-amber-300'  },
  { bg: 'bg-yellow-300' },
  { bg: 'bg-teal-300'   },
  { bg: 'bg-cyan-300'   },
  { bg: 'bg-sky-300'    },
  { bg: 'bg-purple-300' },
]

export default function HabitTracker() {
  const [habits, setHabits] = useLocalStorage('habits', [])
  const [completions, setCompletions] = useLocalStorage('habitCompletions', {})
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newGoal, setNewGoal] = useState('')
  const [colorIdx, setColorIdx] = useState(0)
  const [editingGoal, setEditingGoal] = useState(null) // habitId
  const [goalDraft, setGoalDraft] = useState('')

  const weekDates = getWeekDates(new Date())
  const todayKey = formatDateKey(new Date())

  const addHabit = () => {
    if (!newName.trim()) return
    setHabits((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newName.trim(), goal: newGoal.trim(), colorIdx },
    ])
    setNewName('')
    setNewGoal('')
    setShowAdd(false)
  }

  const removeHabit = (id) => setHabits((prev) => prev.filter((h) => h.id !== id))

  const saveGoal = (id) => {
    setHabits((prev) => prev.map((h) => h.id === id ? { ...h, goal: goalDraft.trim() } : h))
    setEditingGoal(null)
  }

  const toggle = (habitId, dateKey) => {
    setCompletions((prev) => ({
      ...prev,
      [dateKey]: { ...(prev[dateKey] || {}), [habitId]: !prev[dateKey]?.[habitId] },
    }))
  }

  const isDone = (habitId, dateKey) => !!completions[dateKey]?.[habitId]

  const weekRate = (habitId) => {
    const done = weekDates.filter((d) => isDone(habitId, formatDateKey(d))).length
    return Math.round((done / 7) * 100)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-700">Habit Tracker</h2>
          <p className="text-gray-400 text-sm mt-0.5">Build consistency, one day at a time</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-coral-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-coral-600 transition-colors shadow-sm"
        >
          <Plus size={15} />
          Add Habit
        </button>
      </div>

      {/* Add habit panel */}
      {showAdd && (
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <h3 className="font-semibold text-gray-600 mb-3 text-sm">New habit</h3>
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addHabit()}
            placeholder="e.g. Morning meditation, Yoga, Call a friend…"
            className="w-full border border-cream-300 rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-coral-300 mb-3"
          />
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addHabit()}
            placeholder="Goal (optional) — e.g. 3x per week, daily, 1x weekly"
            className="w-full border border-cream-300 rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-coral-300 mb-4"
          />
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-400">Color:</span>
            {PALETTE.map((c, i) => (
              <button
                key={i}
                onClick={() => setColorIdx(i)}
                className={`w-6 h-6 rounded-full ${c.bg} transition-all ${
                  colorIdx === i ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-110'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={addHabit}
              disabled={!newName.trim()}
              className="bg-coral-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-coral-600 disabled:opacity-40 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => { setShowAdd(false); setNewName(''); setNewGoal('') }}
              className="text-gray-400 px-4 py-2 rounded-xl text-sm hover:bg-cream-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {habits.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="grid gap-px bg-cream-200" style={{ gridTemplateColumns: '1fr repeat(7, 44px)' }}>
            <div className="bg-white px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Habit / Goal
            </div>
            {weekDates.map((d, i) => {
              const key = formatDateKey(d)
              const today = key === todayKey
              return (
                <div key={i} className={`bg-white py-2 flex flex-col items-center text-xs font-bold ${today ? 'text-teal-600' : 'text-gray-400'}`}>
                  <span>{formatShortDay(d).slice(0, 1)}</span>
                  <span className={`mt-0.5 w-6 h-6 flex items-center justify-center rounded-full text-xs ${today ? 'bg-teal-500 text-white' : ''}`}>
                    {d.getDate()}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Rows */}
          {habits.map((habit) => {
            const { bg } = PALETTE[habit.colorIdx] ?? PALETTE[0]
            const rate = weekRate(habit.id)
            const isEditingThisGoal = editingGoal === habit.id
            return (
              <div
                key={habit.id}
                className="grid gap-px bg-cream-100 border-t border-cream-100"
                style={{ gridTemplateColumns: '1fr repeat(7, 44px)' }}
              >
                <div className="bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${bg}`} />
                      <span className="text-sm font-semibold text-gray-600 truncate">{habit.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-xs text-gray-300">{rate}%</span>
                      <button onClick={() => removeHabit(habit.id)} className="text-gray-200 hover:text-red-400 transition-colors">
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                  {/* Goal row */}
                  <div className="ml-4 mt-1">
                    {isEditingThisGoal ? (
                      <input
                        autoFocus
                        type="text"
                        value={goalDraft}
                        onChange={(e) => setGoalDraft(e.target.value)}
                        onBlur={() => saveGoal(habit.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveGoal(habit.id); if (e.key === 'Escape') setEditingGoal(null) }}
                        placeholder="e.g. 3x per week"
                        className="text-xs border-b border-coral-300 outline-none text-gray-500 w-full bg-transparent"
                      />
                    ) : (
                      <button
                        onClick={() => { setEditingGoal(habit.id); setGoalDraft(habit.goal || '') }}
                        className="flex items-center gap-1 group"
                      >
                        <span className={`text-xs ${habit.goal ? 'text-teal-500 font-medium' : 'text-gray-300'}`}>
                          {habit.goal || 'Set a goal…'}
                        </span>
                        <Pencil size={10} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )}
                  </div>
                </div>

                {weekDates.map((d, i) => {
                  const key = formatDateKey(d)
                  const done = isDone(habit.id, key)
                  const today = key === todayKey
                  return (
                    <div key={i} className="bg-white flex items-center justify-center">
                      <button
                        onClick={() => toggle(habit.id, key)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          done
                            ? `${bg} text-white shadow-sm`
                            : `border-2 ${today ? 'border-teal-300' : 'border-gray-200'} hover:border-coral-300`
                        }`}
                      >
                        {done && <Check size={13} />}
                      </button>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-14 text-center">
          <div className="text-5xl mb-3">🌱</div>
          <p className="font-semibold text-gray-500">No habits yet</p>
          <p className="text-gray-400 text-sm mt-1">Add your first habit and set a weekly goal to stay on track</p>
        </div>
      )}
    </div>
  )
}
