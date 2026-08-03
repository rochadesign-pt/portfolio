// Duotone gradient block standing in for photography until real images land.
export default function Cover({ colors = ['#c6ff3a', '#0a0a0b'], className = '', label }) {
  const [a, b] = colors
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${a} 0%, ${b} 82%)` }}
    >
      <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" />
      {label && (
        <span className="absolute bottom-4 left-4 label text-text/70 mix-blend-difference">
          {label}
        </span>
      )}
    </div>
  )
}
