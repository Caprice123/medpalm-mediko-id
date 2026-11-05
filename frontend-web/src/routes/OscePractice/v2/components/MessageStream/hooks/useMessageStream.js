import { useEffect, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { loadMoreMessages, loadMorePhysicalExamMessages } from '@store/oscePractice/userAction'

// How far from the top counts as "the student is reaching for older turns".
const NEAR_TOP_PX = 200

// Scrolling for a transcript that grows at both ends: new turns arrive at the bottom, older
// ones are paged in at the top.
export const useMessageStream = ({ messages, isPhysicalExam, isLoading, pagination }) => {
  const { sessionId } = useParams()
  const dispatch = useDispatch()

  const listRef = useRef(null)
  const previousCountRef = useRef(0)
  const hasAnchoredRef = useRef(false)
  const isPagingRef = useRef(false)
  const wasLoadingRef = useRef(false)
  const modeRef = useRef(isPhysicalExam)

  // Scrolls THIS list and nothing else.
  //
  // This used to be `bottomRef.current.scrollIntoView()` on an anchor div at the end of the
  // transcript, which is not a transcript-local operation: scrollIntoView walks up and scrolls
  // every scrollable ancestor, the document included, until the element is in view. So opening
  // the Anamnesis tab in the debrief panel scrolled the whole page to the bottom along with the
  // list — the tab row, the rubric beside it and all.
  //
  // Element.scrollTo touches only the element it is called on, which is what "scroll the chat
  // to the bottom" actually means.
  const scrollToBottom = useCallback((behavior) => {
    const container = listRef.current
    if (!container) return

    container.scrollTo({ top: container.scrollHeight, behavior })
  }, [])

  // First paint of a transcript lands at the bottom with no animation: a station reopened
  // mid-way should show the last thing the patient said, not scroll there in front of you.
  useEffect(() => {
    if (!hasAnchoredRef.current && messages.length > 0) {
      scrollToBottom('instant')
      previousCountRef.current = messages.length
      hasAnchoredRef.current = true
    }
  }, [messages.length, scrollToBottom])

  useEffect(() => {
    if (wasLoadingRef.current && !isLoading && messages.length > 0) {
      scrollToBottom('instant')
      previousCountRef.current = messages.length
    }
    wasLoadingRef.current = isLoading
  }, [isLoading, messages, scrollToBottom])

  // Only a genuinely new turn scrolls, and smoothly. Streaming tokens must not drag the view
  // down on every chunk while the student is reading further up.
  useEffect(() => {
    if (isLoading || !hasAnchoredRef.current) return

    // Switching between anamnesis and physical examination swaps the whole transcript. That
    // is not a new turn arriving, so it lands at the bottom immediately — animating would
    // scroll through a conversation the student did not ask to see.
    if (modeRef.current !== isPhysicalExam) {
      modeRef.current = isPhysicalExam
      previousCountRef.current = messages.length
      scrollToBottom('instant')
      return
    }

    if (messages.length > previousCountRef.current) {
      const id = setTimeout(() => {
        scrollToBottom('smooth')
      }, 100)
      previousCountRef.current = messages.length
      return () => clearTimeout(id)
    }

    previousCountRef.current = messages.length
  }, [messages.length, isLoading, isPhysicalExam, scrollToBottom])

  const handleScroll = useCallback(async () => {
    const container = listRef.current
    if (!container) return

    const shouldPage = container.scrollTop < NEAR_TOP_PX
      && pagination?.hasMore
      && pagination?.nextCursor
      && !isPagingRef.current
      && !isLoading

    if (!shouldPage) return

    isPagingRef.current = true
    const previousHeight = container.scrollHeight
    const previousTop = container.scrollTop

    try {
      const action = isPhysicalExam ? loadMorePhysicalExamMessages : loadMoreMessages
      const loaded = await dispatch(action(sessionId, pagination.nextCursor))

      // Older turns are inserted above, which would otherwise jump the view: restore the
      // student's reading position by the height that was added.
      if (loaded > 0) {
        setTimeout(() => {
          container.scrollTop = previousTop + (container.scrollHeight - previousHeight)
        }, 50)
      }
    } finally {
      isPagingRef.current = false
    }
  }, [dispatch, sessionId, isPhysicalExam, isLoading, pagination])

  useEffect(() => {
    const container = listRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return { listRef }
}
