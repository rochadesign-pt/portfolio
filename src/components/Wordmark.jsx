// Rocha Design Studio wordmark lockup. Interim, font-based recreation in the
// brand grotesk (currentColor, so it themes itself). The overall size is driven
// by the font-size set through `className` (everything below scales in em).
// Replace the inner markup with the official SVG source when available.
export default function Wordmark({ className = '' }) {
  return (
    <span className={`inline-flex flex-col leading-[0.9] ${className}`} aria-label="Rocha Design Studio">
      <span className="display font-semibold uppercase tracking-[-0.01em]">
        Rocha
        <sup className="ml-[0.04em] text-[0.4em] font-medium">®</sup>
      </span>
      <span className="mt-[0.22em] text-[0.34em] font-medium uppercase tracking-[0.34em]">
        Design Studio
      </span>
    </span>
  )
}
