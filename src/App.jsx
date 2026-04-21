import { useState } from 'react'
import { BookOpen, CheckSquare, UtensilsCrossed, ListTodo, Dumbbell, Activity } from 'lucide-react'
import Journal from './components/Journal'
import HabitTracker from './components/HabitTracker'
import MealPlanner from './components/MealPlanner'
import TodoList from './components/TodoList'
import WorkoutTracker from './components/WorkoutTracker'
import OuraTracker from './components/OuraTracker'

const TABS = [
  { id: 'journal',  label: 'Journal',  icon: BookOpen },
  { id: 'habits',   label: 'Habits',   icon: CheckSquare },
  { id: 'meals',    label: 'Meals',    icon: UtensilsCrossed },
  { id: 'workout',  label: 'Workout',  icon: Dumbbell },
  { id: 'todos',    label: 'Tasks',    icon: ListTodo },
  { id: 'oura',     label: 'Oura',     icon: Activity },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('journal')

  const renderContent = () => {
    switch (activeTab) {
      case 'journal':  return <Journal />
      case 'habits':   return <HabitTracker />
      case 'meals':    return <MealPlanner />
      case 'workout':  return <WorkoutTracker />
      case 'todos':    return <TodoList />
      case 'oura':     return <OuraTracker />
      default:         return <Journal />
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 font-sans">

      {/* ── Desktop layout ─────────────────────────────────── */}
      <div className="hidden md:flex h-screen overflow-hidden">
        <aside className="w-64 bg-white border-r border-cream-200 flex flex-col flex-shrink-0">
          {/* Wordmark */}
          <div className="px-6 py-6 border-b border-cream-200">
            <h1 className="text-lg font-extrabold text-coral-600 leading-tight tracking-tight">
              prepared & present
            </h1>
            <p className="text-xs text-gray-400 mt-1 leading-snug">
              for the life you're building day by day
            </p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === id
                    ? 'bg-coral-100 text-coral-700'
                    : 'text-gray-400 hover:bg-cream-100 hover:text-coral-600'
                }`}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>

          <div className="px-6 py-4 text-xs text-gray-300 text-center border-t border-cream-100">
            rooted in intention 🌅
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-5xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* ── Mobile layout ──────────────────────────────────── */}
      <div className="md:hidden flex flex-col min-h-screen">
        <header className="bg-white border-b border-cream-200 px-4 py-3 sticky top-0 z-10">
          <h1 className="text-base font-extrabold text-coral-600 leading-tight">
            prepared & present
          </h1>
          <p className="text-[10px] text-gray-400">for the life you're building day by day</p>
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-24">
          {renderContent()}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200 flex z-10">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-semibold transition-colors ${
                activeTab === id ? 'text-coral-500' : 'text-gray-400'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
