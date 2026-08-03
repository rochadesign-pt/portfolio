import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Live typography playground. Swaps the display/body grotesk and tweaks weight
// + tracking in real time via CSS variables. A tool for choosing direction —
// remove before the final handoff to Framer.
const FONTS = [
  { name: 'Geist', stack: "'Geist', system-ui, sans-serif" },
  { name: 'General Sans', stack: "'General Sans', system-ui, sans-serif" },
  { name: 'Switzer', stack: "'Switzer', system-ui, sans-serif" },
  { name: 'Funnel Sans', stack: "'Funnel Sans', system-ui, sans-serif" },
  { name: 'Space Grotesk', stack: "'Space Grotesk', system-ui, sans-serif" },
  { name: 'Hanken Grotesk', stack: "'Hanken Grotesk', system-ui, sans-serif" },
  { name: 'Onest', stack: "'Onest', system-ui, sans-serif" },
]

const root = () => document.documentElement

function applyState({ stack, weight, tracking }) {
  const r = root().style
  r.setProperty('--font-display', stack)
  r.setProperty('--font-sans', stack)
  r.setProperty('--display-weight', String(weight))
  r.setProperty('--display-tracking', `${tracking}em`)
}

export default function TypePanel() {
  const [open, setOpen] = useState(false)
  const [font, setFont] = useState(FONTS[0].name)
  const [weight, setWeight] = useState(500)
  const [tracking, setTracking] = useState(-0.035)

  // Load saved state once
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('rds-type') || 'null')
      if (saved) {
        setFont(saved.font)
        setWeight(saved.weight)
        setTracking(saved.tracking)
      }
    } catch {
      /* ignore */
    }
  }, [])

  // Apply + persist on change
  useEffect(() => {
    const f = FONTS.find((x) => x.name === font) || FONTS[0]
    applyState({ stack: f.stack, weight, tracking })
    localStorage.setItem('rds-type', JSON.stringify({ font, weight, tracking }))
  }, [font, weight, tracking])

  const reset = () => {
    setFont(FONTS[0].name)
    setWeight(500)
    setTracking(-0.035)
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-lg shadow-2xl transition-colors hover:border-text/40"
        style={{ fontFamily: "var(--font-serif)", fontStyle: 'italic' }}
        aria-label="Type tweaks"
        title="Type tweaks"
      >
        Aa
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-20 right-5 z-[70] w-[290px] rounded-2xl border border-line bg-surface/95 p-5 shadow-2xl backdrop-blur-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="label">Type tweaks</span>
              <button onClick={reset} className="text-xs text-muted underline-offset-4 hover:text-text hover:underline">
                reset
              </button>
            </div>

            {/* Font list */}
            <div className="mb-5 flex flex-col gap-1">
              {FONTS.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setFont(f.name)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-left transition-colors ${
                    font === f.name ? 'bg-surface-2 text-text' : 'text-muted hover:bg-surface-2 hover:text-text'
                  }`}
                  style={{ fontFamily: f.stack }}
                >
                  <span className="text-lg">{f.name}</span>
                  {font === f.name && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                </button>
              ))}
            </div>

            {/* Weight */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="label">Weight</span>
                <span className="tabular-nums text-text">{weight}</span>
              </div>
              <input
                type="range"
                min="300"
                max="700"
                step="50"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-[var(--color-accent)]"
              />
            </div>

            {/* Tracking */}
            <div>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="label">Tracking</span>
                <span className="tabular-nums text-text">{tracking.toFixed(3)}em</span>
              </div>
              <input
                type="range"
                min="-0.06"
                max="0.02"
                step="0.005"
                value={tracking}
                onChange={(e) => setTracking(Number(e.target.value))}
                className="w-full accent-[var(--color-accent)]"
              />
            </div>

            <p className="mt-5 text-[11px] leading-snug text-muted">
              Preview em tempo real. A escolha fica guardada neste browser. Removo o painel antes do handoff.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
