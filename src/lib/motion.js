// Shared motion tokens — keep easings and timings consistent across the site.

export const easeSoft = [0.25, 1, 0.5, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeSoft },
  },
}
