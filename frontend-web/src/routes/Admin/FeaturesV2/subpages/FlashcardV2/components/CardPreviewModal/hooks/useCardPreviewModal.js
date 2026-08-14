import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { fetchNodeCardDetail } from '@store/nodeCards'

// Accepts either a full `card` object (e.g. live unsaved preview from CardFormModal) or a
// `cardId` + `nodeId` pair (e.g. the Preview button on the card list, which only has the
// lightweight list row) — in the latter case it fetches the full detail itself.
export function useCardPreviewModal({ card, cardId, nodeId }) {
  const dispatch = useDispatch()
  const [fetchedCard, setFetchedCard] = useState(null)
  const [isLoading, setIsLoading] = useState(!!cardId)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!cardId) return
    let cancelled = false
    setIsLoading(true)
    dispatch(fetchNodeCardDetail(nodeId, cardId))
      .then((detail) => { if (!cancelled) setFetchedCard(detail) })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [cardId, nodeId])

  const resolvedCard = card || fetchedCard

  useEffect(() => {
    setRevealed(false)
  }, [resolvedCard?.id])

  const handleReveal = useCallback(() => setRevealed(true), [])

  return { resolvedCard, isLoading, revealed, handleReveal }
}
