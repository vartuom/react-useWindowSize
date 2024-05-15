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
function throttle<T extends (...args: Parameters<T>) => void>(
  this: ThisParameterType<T>,
  fn: T,
  delay = 100,
) {
  let inThrottle: boolean
  let timer: ReturnType<typeof setTimeout>
  let lastTime: number

  return (...args: Parameters<T>) => {
    if (inThrottle) {
      clearTimeout(timer)
      timer = setTimeout(
        () => {
          if (Date.now() - lastTime >= delay) {
            fn.apply(this, args)
            lastTime = Date.now()
          }
        },
        Math.max(delay - (Date.now() - lastTime), 0),
      )
    } else {
      fn.apply(this, args)
      lastTime = Date.now()
      inThrottle = true
    }
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
