// Rocha Design Studio "R" mark. Faithful SVG recreation — monochrome, drawn in
// currentColor so it adapts to the theme (and the inverted footer) on its own.
// Swap the path for the official SVG source when available.
export default function Logo({ className = '', title }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 16 L57 16 C71 16 81 25 81 40 C81 52 74 60 62 62 L81 84 L63 84 L45 62 L41 62 L41 84 L24 84 Z M41 31 L56 31 C63 31 67 35 67 41 C67 47 63 51 56 51 L41 51 Z"
      />
    </svg>
  )
}
