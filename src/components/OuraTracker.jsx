import { useState } from 'react'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import useLocalStorage from '../hooks/useLocalStorage'
import { formatDateKey, formatDisplayDate, addDays, isToday } from '../utils/dates'

function ScoreRing({ value, color }) {
  const pct = Math.min(100, Math.max(0, value || 0))
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference
  const colorMap = {
    coral: ['#e8604a', '#ffe8e2'],
    teal:  ['#2ea0a0', '#d8f2f2'],
    amber: ['#d97706', '#fef3c7'],
  }
  const [stroke, bg] = colorMap[color] ?? colorMap.coral

  return (
    <svg width="72" height="72" className="-rotate-90">
      <circle cx="36" cy="36" r={radius} fill="none" stroke={bg} strokeWidth="6" />
      <circle
        cx="36" cy="36" r={radius}
        fill="none"
        stroke={stroke}
        strokeWidth="6"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  )
}

function generateRecommendation(readiness, sleep, activity) {
  const r = parseInt(readiness) || 0
  const s = parseInt(sleep) || 0
  const a = parseInt(activity) || 0
  if (!r && !s && !a) return ''

  const parts = []

  if (r >= 85) {
    parts.push(`Your readiness score of ${r} means your body is fully charged — today is a great day to push hard in training, tackle a demanding project, or try something new.`)
  } else if (r >= 70) {
    parts.push(`With a readiness score of ${r}, you're in solid shape. Moderate-to-high effort will feel good today — trust your body and lean in.`)
  } else if (r >= 50) {
    parts.push(`Your readiness score of ${r} is a gentle nudge to pace yourself. Opt for lighter movement — a walk, yoga, or stretching — and focus on quality over intensity.`)
  } else if (r > 0) {
    parts.push(`Your readiness score of ${r} is calling for rest. Skip intense training today, eat nourishing food, and make sleep your top priority tonight.`)
  }

  if (s >= 85) {
    parts.push(`Your sleep score of ${s} is excellent — your mind has had the deep recovery it needs to focus and create today.`)
  } else if (s >= 70) {
    parts.push(`Sleep score of ${s} is solid. You'll be sharpest in the morning, so protect that window for your most important thinking.`)
  } else if (s > 0) {
    parts.push(`Your sleep score of ${s} suggests incomplete recovery. Keep caffeine to the morning, consider a short nap before 3pm, and aim for an earlier bedtime tonight.`)
  }

  if (a >= 90) {
    parts.push(`Activity score of ${a} — you've been moving a lot lately. Balance that effort with extra protein and an intentional recovery day soon.`)
  } else if (a >= 70) {
    parts.push(`Activity score of ${a} shows you've been consistent. Keep up the momentum.`)
  } else if (a > 0 && a < 60) {
    parts.push(`Your activity score of ${a} suggests room to move more. Even a 20-minute walk will meaningfully shift your energy, mood, and sleep tonight.`)
  }

  return parts.join(' ')
}

const SCORE_LABEL = (v) => {
  const n = parseInt(v) || 0
  if (n >= 85) return { label: 'Optimal', color: 'text-teal-600' }
  if (n >= 70) return { label: 'Good', color: 'text-teal-500' }
  if (n >= 50) return { label: 'Fair', color: 'text-amber-500' }
  if (n > 0)   return { label: 'Low', color: 'text-coral-500' }
  return { label: '—', color: 'text-gray-300' }
}

const EMPTY = { readiness: '', sleep: '', activity: '', recommendation: '' }

export default function OuraTracker() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [data, setData] = useLocalStorage('ouraData', {})
  const [generating, setGenerating] = useState(false)

  const dateKey = formatDateKey(currentDate)
  const entry = data[dateKey] ?? EMPTY
  const todayFlag = isToday(currentDate)

  const update = (field, value) => {
    setData((prev) => ({ ...prev, [dateKey]: { ...EMPTY, ...(prev[dateKey] || {}), [field]: value } }))
  }

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      const rec = generateRecommendation(entry.readiness, entry.sleep, entry.activity)
      update('recommendation', rec)
      setGenerating(false)
    }, 800)
  }

  const navigate = (days) => {
    setCurrentDate((d) => {
      const next = addDays(d, days)
      return days > 0 && isToday(next) ? new Date() : next
    })
  }

  const hasScores = entry.readiness || entry.sleep || entry.activity

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-gray-700">Oura Scores</h2>
        <p className="text-gray-400 text-sm mt-0.5">Log your daily recovery data and get a recommendation</p>
      </div>

      {/* Date nav */}
      <div className="flex items-center gap-3 mb-5 bg-white rounded-2xl px-4 py-3 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-cream-100 transition-colors text-gray-400 hover:text-gray-600">
          <ChevronLeft size={19} />
        </button>
        <div className="flex-1 text-center">
          <p className="font-semibold text-gray-700 text-sm">{formatDisplayDate(currentDate)}</p>
          {todayFlag && <span className="text-xs font-bold text-coral-400">Today</span>}
        </div>
        <button
          onClick={() => navigate(1)}
          disabled={todayFlag}
          className={`p-1.5 rounded-full transition-colors ${todayFlag ? 'text-gray-200 cursor-not-allowed' : 'hover:bg-cream-100 text-gray-400 hover:text-gray-600'}`}
        >
          <ChevronRight size={19} />
        </button>
      </div>

      {/* Score rings */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { key: 'readiness', label: 'Readiness', color: 'coral' },
            { key: 'sleep',     label: 'Sleep',     color: 'teal'  },
            { key: 'activity',  label: 'Activity',  color: 'amber' },
          ].map(({ key, label, color }) => {
            const val = entry[key] || ''
            const { label: scoreLabel, color: scoreColor } = SCORE_LABEL(val)
            return (
              <div key={key} className="flex flex-col items-center gap-1">
                <div className="relative">
                  <ScoreRing value={parseInt(val) || 0} color={color} />
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-gray-700 rotate-90" style={{ transform: 'rotate(90deg)' }}>
                    {val || '–'}
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-500">{label}</p>
                <p className={`text-xs font-semibold ${scoreColor}`}>{scoreLabel}</p>
              </div>
            )
          })}
        </div>

        {/* Score inputs */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'readiness', label: 'Readiness', placeholder: '0–100' },
            { key: 'sleep',     label: 'Sleep',     placeholder: '0–100' },
            { key: 'activity',  label: 'Activity',  placeholder: '0–100' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-400 mb-1">{label}</label>
              <input
                type="number"
                min="0"
                max="100"
                value={entry[key] || ''}
                onChange={(e) => update(key, e.target.value)}
                placeholder={placeholder}
                className="w-full border border-cream-300 rounded-xl px-3 py-2 text-sm text-gray-700 font-semibold outline-none focus:border-coral-300 text-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Generate recommendation */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-gray-600">Activity & Rest Recommendation</p>
          <button
            onClick={handleGenerate}
            disabled={!hasScores || generating}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-coral-500 hover:bg-coral-600 disabled:opacity-40 px-3 py-1.5 rounded-xl transition-colors"
          >
            <Sparkles size={13} className={generating ? 'animate-pulse' : ''} />
            {generating ? 'Generating…' : 'Generate'}
          </button>
        </div>

        {entry.recommendation ? (
          <p className="text-sm text-gray-600 leading-relaxed">{entry.recommendation}</p>
        ) : (
          <p className="text-sm text-gray-300 italic">
            {hasScores
              ? 'Hit "Generate" for a personalized recommendation based on your scores.'
              : 'Enter your Oura scores above, then generate a personalized recommendation.'}
          </p>
        )}
      </div>
    </div>
  )
}
