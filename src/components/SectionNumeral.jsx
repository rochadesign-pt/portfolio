// Oversized, near-invisible index numeral placed behind a section header for
// editorial scale and depth. Decorative only.
export default function SectionNumeral({ children, className = '' }) {
  return (
    <span aria-hidden="true" className={`section-numeral display text-[26vw] md:text-[15rem] ${className}`}>
      {children}
    </span>
  )
}
