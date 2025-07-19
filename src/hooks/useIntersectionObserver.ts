import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverProps {
  threshold?: number
  root?: Element | null
  rootMargin?: string
  freezeOnceVisible?: boolean
}

/**
 * Custom hook for Intersection Observer API
 * Optimized for performance with proper cleanup
 */
export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = '0%',
  freezeOnceVisible = false,
}: UseIntersectionObserverProps = {}) {
  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const [node, setNode] = useState<Element | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)

  const frozen = entry?.isIntersecting && freezeOnceVisible

  useEffect(() => {
    // Disconnect previous observer
    if (observer.current) observer.current.disconnect()

    // Don't observe if frozen or no node
    if (frozen || !node) return

    const observerParams = { threshold, root, rootMargin }
    const isSupported = window.IntersectionObserver

    if (!isSupported) {
      console.warn('IntersectionObserver is not supported')
      return
    }

    observer.current = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => setEntry(entry),
      observerParams
    )

    observer.current.observe(node)

    return () => observer.current?.disconnect()
  }, [node, threshold, root, rootMargin, frozen])

  const ref = (node: Element | null) => {
    setNode(node)
  }

  return [ref, !!entry?.isIntersecting, entry] as const
}