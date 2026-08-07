import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

// A guided brief builder that sits above the contact form. Instead of facing a
// blank form, a visitor can answer four quick questions — scope, budget,
// timing, a one-line description — and we compose a tidy brief and pre-fill the
// form for them. No black box: everything it writes lands in editable fields.
export default function BriefBuilder({ b, helpOptions, budgetOptions, onApply }) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [scope, setScope] = useState([])
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')
  const [line, setLine] = useState('')

  const steps = [
    { q: b.q1, kind: 'multi', options: helpOptions, value: scope },
    { q: b.q2, kind: 'single', options: budgetOptions, value: budget },
    { q: b.q3, kind: 'single', options: b.timelineOptions, value: timeline },
    { q: b.q4, kind: 'text', value: line },
  ]
  const cur = steps[step]
  const last = step === steps.length - 1
  const canAdvance =
    cur.kind === 'multi' ? scope.length > 0 : cur.kind === 'text' ? line.trim().length > 0 : !!cur.value

  const toggleScope = (opt) =>
    setScope((s) => (s.includes(opt) ? s.filter((x) => x !== opt) : [...s, opt]))

  const reset = () => {
    setOpen(false)
    setStep(0)
    setScope([])
    setBudget('')
    setTimeline('')
    setLine('')
  }

  const apply = () => {
    const parts = [line.trim()]
    if (scope.length) parts.push(`${b.scopeLabel}: ${scope.join(', ')}.`)
    if (timeline) parts.push(`${b.timelineLabel}: ${timeline}.`)
    onApply({ help: scope, budget, message: parts.filter(Boolean).join('\n\n') })
    reset()
  }

  const next = () => (last ? apply() : setStep((s) => s + 1))
  const back = () => setStep((s) => Math.max(0, s - 1))

  const chip = (label, on, onClick) => (
    <button
      type="button"
      key={label}
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
        on
          ? 'border-accent bg-accent text-accent-ink'
          : 'border-line text-muted hover:border-text hover:text-text'
      }`}
    >
      {label}
    </button>
  )

  if (!open) {
    return (
      <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-line p-6 sm:flex-row sm:items-center sm:justify-between md:p-7">
        <div>
          <p className="label mb-1.5 text-accent-text">✦ {b.eyebrow}</p>
          <p className="text-sm text-muted">{b.hint}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 self-start rounded-full border border-text px-6 py-2.5 text-sm font-medium transition-colors hover:bg-text hover:text-bg sm:self-auto"
        >
          {b.cta} →
        </button>
      </div>
    )
  }

  return (
    <div className="mb-10 rounded-2xl border border-line p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <p className="label text-accent-text">
          ✦ {b.step} {step + 1} {b.of} {steps.length}
        </p>
        <button
          type="button"
          onClick={reset}
          className="text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-text"
        >
          {b.skip}
        </button>
      </div>

      {/* progress hairline */}
      <div className="mb-8 h-px w-full bg-line">
        <div
          className="h-px bg-accent-text transition-[width] duration-500"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="display mb-6 text-2xl md:text-3xl">{cur.q}</h3>

          {cur.kind === 'text' ? (
            <textarea
              autoFocus
              value={line}
              onChange={(e) => setLine(e.target.value)}
              rows={3}
              placeholder={b.q4ph}
              className="w-full resize-none border-b border-line bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-muted focus:border-accent"
            />
          ) : (
            <div className="flex flex-wrap gap-3">
              {cur.options.map((opt) =>
                cur.kind === 'multi'
                  ? chip(opt, scope.includes(opt), () => toggleScope(opt))
                  : chip(opt, cur.value === opt, () =>
                      step === 1 ? setBudget(opt) : setTimeline(opt),
                    ),
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="text-sm text-muted transition-colors hover:text-text disabled:opacity-0"
        >
          ← {b.back}
        </button>
        <button
          type="button"
          onClick={next}
          disabled={!canAdvance}
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {last ? `${b.apply} →` : b.next}
        </button>
      </div>
    </div>
  )
}
