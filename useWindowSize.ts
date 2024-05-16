import { useState, useEffect } from 'react'

// use debounce...
function debounce<T extends (...args: Parameters<T>) => void>(
  this: ThisParameterType<T>,
  fn: T,
  delay = 100,
) {
  let timer: ReturnType<typeof setTimeout> | undefined

  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// ...or throttle
function throttle<T extends (...args: Parameters<T>) => void>(fn: T, timeout: number) {
  let timer: ReturnType<typeof setTimeout> | undefined

  return function perform(...args: Parameters<T>) {
    if (timer) {
      return
    }

    timer = setTimeout(() => {
      fn(...args)

      clearTimeout(timer)
      timer = undefined
    }, timeout)
  }
}

export function useWindowSize() {
  const isServerSide = typeof window === 'undefined'
  const [dimensions, setDimensions] = useState(
    isServerSide ? [0, 0] : [window.innerWidth, window.innerHeight],
  )

  useEffect(() => {
    if (!isServerSide) {
      const resizeHandler = throttle(() => {
        setDimensions([window.innerWidth, window.innerHeight])
      }, 300)
      window.addEventListener('resize', resizeHandler)

      return () => window.removeEventListener('resize', resizeHandler)
    }

    return () => {}
  }, [isServerSide])

  return dimensions
}
