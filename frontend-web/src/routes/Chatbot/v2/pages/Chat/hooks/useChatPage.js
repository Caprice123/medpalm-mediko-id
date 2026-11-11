import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { bootstrapChatbot } from '@store/chatbot/v2'

// State owned by the Chat page itself: the one bootstrap read, and the desktop
// scroll lock. V1 did both inline in its page component.
export const useChatPage = () => {
  const dispatch = useDispatch()

  // The chat is a two-pane app filling the viewport, so the document behind it
  // must not scroll as well. Only on desktop: on a phone each pane is a full
  // screen and the page scroll is what the thread uses.
  useEffect(() => {
    if (window.innerWidth < 769) return

    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = original
    }
  }, [])

  // Modes, costs, per-mode notice and this user's research settings — one request.
  useEffect(() => {
    dispatch(bootstrapChatbot())
  }, [dispatch])
}
