import { useState, useEffect } from 'react'

/**
 * useStorage — persists state to localStorage.
 * Replaces the window.storage API used in the Claude artifact.
 */
export function useStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.warn('localStorage write failed:', e)
    }
  }, [key, value])

  return [value, setValue]
}
