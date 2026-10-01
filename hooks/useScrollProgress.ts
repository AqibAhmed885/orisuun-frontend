import { useEffect, useRef, useState } from 'react'

type Options = {
  /** viewport ratio where progress starts (0-1), measured from top (1 = bottom) */
  start?: number
  /** viewport ratio where progress ends (0-1), measured from top */
  end?: number
}

/**
 * Returns a ref and a normalized progress (0..1) representing
 * how far the element has moved through the viewport between start and end.
 * Progress increases as the element scrolls down the screen.
 */
export function useScrollProgress(options: Options = {}) {
  const { start = 0.9, end = 0.1 } = options
  const ref = useRef<HTMLElement | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    const onFrame = () => {
      ticking = false
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight

      // Convert ratios to pixel thresholds
      const startPx = vh * start
      const endPx = vh * end

      // We track the element's top moving from startPx -> endPx
      const raw = (startPx - rect.top) / (startPx - endPx)
      const clamped = Math.max(0, Math.min(1, raw))
      setProgress(clamped)
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(onFrame)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // Initialize once mounted
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [start, end])

  return [ref, progress] as const
}

export default useScrollProgress
