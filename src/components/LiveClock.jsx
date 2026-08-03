import { useEffect, useState } from 'react'

// Live local time in Aveiro (Europe/Lisbon) — a small "we connect live data" flourish.
export default function LiveClock({ className = '' }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Europe/Lisbon',
  }).format(now)

  // Timezone label (GMT / GMT+1 in summer)
  const tz =
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Lisbon', timeZoneName: 'short' })
      .formatToParts(now)
      .find((p) => p.type === 'timeZoneName')?.value || 'GMT'

  return (
    <span className={`inline-flex items-center gap-2 tabular-nums ${className}`}>
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      <span>
        Based in Aveiro, Portugal
        <span className="mx-2 text-muted">·</span>
        {time} ({tz})
      </span>
    </span>
  )
}
