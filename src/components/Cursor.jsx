import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Custom cursor — a lagging ring + instant dot. Grows over interactive
// elements. Desktop pointers only; never renders for touch / reduced-motion.
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [down, setDown] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.4 })
  const ry = useSpring(y, { stiffness: 350, damping: 30, mass: 0.4 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    setEnabled(true)
    document.documentElement.classList.add('has-cursor')

    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const interactive = e.target.closest('a, button, [data-cursor], input, textarea, select')
      setHovering(Boolean(interactive))
    }
    const dn = () => setDown(true)
    const up = () => setDown(false)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerdown', dn)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', dn)
      window.removeEventListener('pointerup', up)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden lg:block" aria-hidden>
      {/* Ring */}
      <motion.div
        className="fixed left-0 top-0 rounded-full border border-white mix-blend-difference"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: hovering ? 56 : 32,
          height: hovering ? 56 : 32,
          opacity: down ? 0.5 : 1,
          scale: down ? 0.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      />
      {/* Dot */}
      <motion.div
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: hovering ? 0 : 1 }}
      />
    </div>
  )
}
