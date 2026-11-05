import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchOscePerformance } from '@store/oscePractice/userAction'

// Owns the one effect behind the card. The numbers themselves are read straight from Redux in
// the component — nothing here processes them, so returning them would only add a hop.
export function usePerformanceCard() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchOscePerformance())
  }, [dispatch])
}
