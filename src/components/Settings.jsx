import { useState } from 'react'
import { Save, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function Settings({ settings, onSave }) {
  const [apiKey, setApiKey] = useState(settings.apiKey || '')
  const [calendarId, setCalendarId] = useState(settings.calendarId || '')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSave({ apiKey: apiKey.trim(), calendarId: calendarId.trim() })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const changed =
    apiKey.trim() !== settings.apiKey || calendarId.trim() !== settings.calendarId

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-700">Settings</h2>
        <p className="text-gray-400 text-sm mt-0.5">Configure your Google Calendar integration</p>
      </div>

      {/* Google Calendar card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">📅</span>
          <h3 className="font-bold text-gray-700">Google Calendar</h3>
        </div>
        <p className="text-xs text-gray-400 mb-5">
          Connect your calendar to see upcoming events on the Calendar tab. Requires a
          public calendar or an API key scoped to your account.
        </p>

        {/* API Key */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy…"
              className="w-full border border-cream-300 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-600 outline-none focus:border-sage-400 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Calendar ID */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">
            Calendar ID
          </label>
          <input
            type="text"
            value={calendarId}
            onChange={(e) => setCalendarId(e.target.value)}
            placeholder="you@gmail.com  or  abc123@group.calendar.google.com"
            className="w-full border border-cream-300 rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-sage-400 transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1.5">
            Find this in Google Calendar → Settings → Integrate calendar
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={!changed && !saved}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            saved
              ? 'bg-sage-100 text-sage-600 cursor-default'
              : 'bg-sage-500 text-white hover:bg-sage-600 disabled:opacity-40'
          }`}
        >
          {saved ? <CheckCircle size={15} /> : <Save size={15} />}
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      {/* Setup guide */}
      <div className="bg-cream-50 rounded-2xl p-5">
        <h4 className="font-bold text-gray-600 mb-3 text-sm">How to set up</h4>
        <ol className="space-y-2.5 text-sm text-gray-500">
          <li className="flex gap-2">
            <span className="text-sage-400 font-bold flex-shrink-0">1.</span>
            Go to{' '}
            <a
              href="https://console.cloud.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-500 hover:underline"
            >
              Google Cloud Console
            </a>
            {' '}and create or select a project
          </li>
          <li className="flex gap-2">
            <span className="text-sage-400 font-bold flex-shrink-0">2.</span>
            Enable the <strong className="text-gray-600">Google Calendar API</strong> for your project
          </li>
          <li className="flex gap-2">
            <span className="text-sage-400 font-bold flex-shrink-0">3.</span>
            Under <em>Credentials</em>, create an <strong className="text-gray-600">API Key</strong> and restrict it to the Calendar API
          </li>
          <li className="flex gap-2">
            <span className="text-sage-400 font-bold flex-shrink-0">4.</span>
            In Google Calendar settings, set your calendar to <strong className="text-gray-600">Public</strong> (or use OAuth for private calendars)
          </li>
          <li className="flex gap-2">
            <span className="text-sage-400 font-bold flex-shrink-0">5.</span>
            Copy your <strong className="text-gray-600">Calendar ID</strong> from Settings → Integrate calendar and paste it above
          </li>
        </ol>
      </div>
    </div>
  )
}
