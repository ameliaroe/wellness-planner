import { useState, useEffect, useCallback } from 'react'
import { Calendar, Clock, MapPin, ExternalLink, RefreshCw } from 'lucide-react'

function toLocalDateKey(isoString) {
  return new Date(isoString).toDateString()
}

function formatEventTime(event) {
  if (event.start.date) {
    return new Date(event.start.date + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }) + ' · All day'
  }
  const start = new Date(event.start.dateTime)
  const end = new Date(event.end.dateTime)
  const opts = { hour: 'numeric', minute: '2-digit' }
  return (
    start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' · ' +
    start.toLocaleTimeString('en-US', opts) +
    ' – ' +
    end.toLocaleTimeString('en-US', opts)
  )
}

function EventCard({ event, accent }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm p-4 flex gap-3 ${accent ? 'ring-1 ring-sage-200' : ''}`}>
      <div className={`w-1 rounded-full flex-shrink-0 self-stretch ${accent ? 'bg-sage-400' : 'bg-cream-300'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-700 leading-snug">
          {event.summary || '(No title)'}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <Clock size={11} className="text-gray-400 flex-shrink-0" />
          <p className="text-xs text-gray-400">{formatEventTime(event)}</p>
        </div>
        {event.location && (
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={11} className="text-gray-400 flex-shrink-0" />
            <p className="text-xs text-gray-400 truncate">{event.location}</p>
          </div>
        )}
      </div>
      {event.htmlLink && (
        <a
          href={event.htmlLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-200 hover:text-sage-500 transition-colors self-start mt-0.5"
        >
          <ExternalLink size={13} />
        </a>
      )}
    </div>
  )
}

export default function CalendarWidget({ settings }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchEvents = useCallback(async () => {
    if (!settings.apiKey || !settings.calendarId) return
    setLoading(true)
    setError(null)
    try {
      const now = new Date().toISOString()
      const twoWeeksOut = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      const url =
        `https://www.googleapis.com/calendar/v3/calendars/` +
        `${encodeURIComponent(settings.calendarId)}/events` +
        `?key=${settings.apiKey}` +
        `&timeMin=${now}&timeMax=${twoWeeksOut}` +
        `&maxResults=20&singleEvents=true&orderBy=startTime`
      const res = await fetch(url)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error?.message || `HTTP ${res.status}`)
      }
      const data = await res.json()
      setEvents(data.items || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [settings.apiKey, settings.calendarId])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const todayStr = new Date().toDateString()
  const todayEvents = events.filter((e) => toLocalDateKey(e.start.dateTime || e.start.date + 'T00:00:00') === todayStr)
  const upcomingEvents = events.filter((e) => toLocalDateKey(e.start.dateTime || e.start.date + 'T00:00:00') !== todayStr)

  if (!settings.apiKey || !settings.calendarId) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-gray-700">Calendar</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-14 text-center">
          <Calendar size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="font-semibold text-gray-500">Connect your Google Calendar</p>
          <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
            Add your API key and Calendar ID in{' '}
            <span className="text-sage-500 font-semibold">Settings</span> to see your upcoming events here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-700">Calendar</h2>
          <p className="text-gray-400 text-sm mt-0.5">Upcoming events · next 2 weeks</p>
        </div>
        <button
          onClick={fetchEvents}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-sage-500 hover:text-sage-700 font-semibold transition-colors disabled:opacity-40"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {loading && (
        <div className="text-center py-14">
          <div className="w-7 h-7 border-2 border-sage-200 border-t-sage-500 rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm mt-3">Loading events…</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl p-4">
          <strong>Could not load events:</strong> {error}.
          <br />
          <span className="text-xs text-red-400 mt-1 block">
            Check your API key and Calendar ID in Settings. Make sure the calendar is public or the API key has access.
          </span>
        </div>
      )}

      {!loading && !error && (
        <>
          {todayEvents.length > 0 && (
            <section className="mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Today</p>
              <div className="space-y-2">
                {todayEvents.map((e) => <EventCard key={e.id} event={e} accent />)}
              </div>
            </section>
          )}

          {upcomingEvents.length > 0 && (
            <section>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Upcoming</p>
              <div className="space-y-2">
                {upcomingEvents.map((e) => <EventCard key={e.id} event={e} />)}
              </div>
            </section>
          )}

          {events.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-14 text-center">
              <p className="text-gray-500 font-semibold">No upcoming events</p>
              <p className="text-gray-400 text-sm mt-1">Your calendar is clear — enjoy the open space! 🌿</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
