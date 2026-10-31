import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchHomeStats } from '@store/home/userAction'

// Fetches the public counts and then keeps them current on an interval, so the
// figures on screen tick up while someone is sitting on the page rather than
// being whatever they were when it loaded.
//
// Used by both surfaces that display those counts — the landing hero and the
// sign-in card — so the polling behaviour is defined once.
const DEFAULT_INTERVAL = 30000

export function useLiveHomeStats(intervalMs = DEFAULT_INTERVAL) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchHomeStats())

    const poll = () => {
      // A background tab cannot show the change, so the request is waste —
      // and on a page left open overnight it is a lot of waste. The next
      // visible tick refreshes it.
      if (typeof document !== 'undefined' && document.hidden) return
      dispatch(fetchHomeStats())
    }

    const id = setInterval(poll, intervalMs)
    return () => clearInterval(id)
  }, [dispatch, intervalMs])
}

export default useLiveHomeStats
