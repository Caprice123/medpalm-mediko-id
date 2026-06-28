import { lazy } from 'react'

// Wraps React.lazy so that a stale-chunk 404 (after a new deploy) triggers a
// one-time hard reload instead of showing a blank error screen.
const lazyWithRetry = (importFn) =>
  lazy(() =>
    importFn().catch((err) => {
      if (!sessionStorage.getItem('chunk-reload')) {
        sessionStorage.setItem('chunk-reload', '1')
        window.location.reload()
        return new Promise(() => {})
      }
      throw err
    })
  )

export default lazyWithRetry
