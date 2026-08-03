// Shared motion tokens — keep easings and timings consistent across the site.

export const easeSoft = [0.25, 1, 0.5, 1]
export const easeIos = [0.32, 0.72, 0, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeSoft },
  },
}

export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeSoft } },
}

export const viewportOnce = { once: true, margin: '-12%' }
