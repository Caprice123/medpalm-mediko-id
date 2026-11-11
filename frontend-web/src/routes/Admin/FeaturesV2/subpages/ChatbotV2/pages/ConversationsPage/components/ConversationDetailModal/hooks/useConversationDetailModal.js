import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  openAdminConversation,
  loadMoreAdminConversationMessages,
} from '@store/chatbot/v2/adminAction'

// Distance from the top at which the next page of older messages is fetched.
const LOAD_TRIGGER_PX = 100

export const useConversationDetailModal = ({ conversation, isOpen }) => {
  const dispatch = useDispatch()
  const messages = useSelector(state => state.chatbotAdminV2.messages)
  const pagination = useSelector(state => state.chatbotAdminV2.messagePagination)
  const isFetching = useSelector(state => state.chatbotAdminV2.loading.isFetchingMessages)

  const scrollerRef = useRef(null)
  const scrollHeightBeforePaging = useRef(0)
  // The modal opens scrolled to the top for an instant before jumping to the
  // newest message; without this the scroll handler reads that as "the admin
  // scrolled up" and immediately pages back.
  const isOpeningRef = useRef(false)

  useEffect(() => {
    if (!isOpen || !conversation?.uniqueId) return

    scrollHeightBeforePaging.current = 0
    isOpeningRef.current = true

    dispatch(openAdminConversation(conversation.uniqueId))
  }, [isOpen, conversation?.uniqueId, dispatch])

  // Land on the newest message once the first page is in.
  useEffect(() => {
    if (!isOpeningRef.current || isFetching) return
    if (pagination.page !== 1 || messages.length === 0) return

    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight
    }

    const release = setTimeout(() => {
      isOpeningRef.current = false
    }, 500)

    return () => clearTimeout(release)
  }, [isFetching, pagination.page, messages.length])

  // Hold the reading position when older messages are inserted above.
  useEffect(() => {
    if (pagination.page <= 1 || !scrollerRef.current) return
    if (scrollHeightBeforePaging.current === 0) return

    const grown = scrollerRef.current.scrollHeight - scrollHeightBeforePaging.current
    if (grown > 0) {
      scrollerRef.current.scrollTop = grown
      scrollHeightBeforePaging.current = 0
    }
  }, [messages, pagination.page])

  const handleScroll = (event) => {
    if (isOpeningRef.current || isFetching || pagination.isLastPage) return
    if (event.target.scrollTop >= LOAD_TRIGGER_PX) return

    scrollHeightBeforePaging.current = event.target.scrollHeight
    dispatch(loadMoreAdminConversationMessages(conversation.uniqueId))
  }

  return {
    messages,
    pagination,
    isFetching,
    scrollerRef,
    handleScroll,
  }
}
