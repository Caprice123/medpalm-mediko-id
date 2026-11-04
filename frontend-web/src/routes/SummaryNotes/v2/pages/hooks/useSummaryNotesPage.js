import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams, generatePath } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchRecentlyViewed } from '@store/summaryNotes/v2/userAction'
import { SummaryNotesRoute } from '../../../routes'

// Matches the breakpoint the styles use to turn the sidebar from a column into an
// overlay drawer.
const MOBILE_BREAKPOINT = 768

function readInitialNavOpen() {
  try {
    return window.innerWidth > MOBILE_BREAKPOINT
  } catch {
    return true
  }
}

// The selected note lives in the URL, not in component state: that makes every note
// a shareable link, and makes the browser's back/forward buttons step through the
// notes a reader has opened.
//
// There is one navigation state, not a separate "collapsed" and "full screen" pair —
// those were the same thing wearing two names. Picking a note closes it, so choosing
// what to read hands the whole pane over to reading it; the toolbar toggle brings the
// list back.
export function useSummaryNotesPage() {
  const { id: routeNoteId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [emptyNodeId, setEmptyNodeId] = useState(null)
  const [isNavOpen, setIsNavOpen] = useState(readInitialNavOpen)

  const selectedNoteId = routeNoteId || null

  useEffect(() => {
    dispatch(fetchRecentlyViewed())
  }, [dispatch])

  // A note arriving from the URL clears any "subtopic has no note yet" state, so
  // using back/forward out of an empty subtopic lands on the note, not on both.
  useEffect(() => {
    if (routeNoteId) setEmptyNodeId(null)
  }, [routeNoteId])

  const selectNote = useCallback((noteId) => {
    setIsNavOpen(false)
    if (noteId === routeNoteId) return
    navigate(generatePath(SummaryNotesRoute.detailRoute, { id: noteId }))
  }, [navigate, routeNoteId])

  const selectEmptyNode = useCallback((nodeId) => {
    setEmptyNodeId(nodeId)
    if (routeNoteId) navigate(SummaryNotesRoute.initialRoute)
  }, [navigate, routeNoteId])

  const toggleNav = useCallback(() => setIsNavOpen(prev => !prev), [])
  const closeNav = useCallback(() => setIsNavOpen(false), [])

  return {
    selectedNoteId,
    emptyNodeId,
    isNavOpen,
    selectNote,
    selectEmptyNode,
    toggleNav,
    closeNav,
  }
}
