import { useState, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { fetchNodePreview } from '@store/featureNodes'
import { fetchSummaryNoteDetailV2 } from '@store/summaryNotes/v2/userAction'

export function useSummaryNotesTab(subtopic) {
  const dispatch = useDispatch()
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [noteDetail, setNoteDetail] = useState(null)
  const [noteDetailLoading, setNoteDetailLoading] = useState(false)

  const openNote = (note) => {
    setSelectedNote(note)
    setNoteDetail(null)
    setNoteDetailLoading(true)
    dispatch(fetchSummaryNoteDetailV2(note.uniqueId)).then(detail => {
      setNoteDetail(detail)
      setNoteDetailLoading(false)
    })
  }

  // a subtopic has at most one summary note, so when there's exactly one,
  // open it directly instead of showing a list to click.
  useEffect(() => {
    if (!subtopic?.id) return
    dispatch(fetchNodePreview(subtopic.id, 'summary_note')).then(data => {
      const list = data || []
      setNotes(list)
      if (list.length === 1) openNote(list[0])
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtopic?.id, dispatch])

  const parsedContent = useMemo(() => {
    if (!noteDetail?.content) return null
    try { return typeof noteDetail.content === 'string' ? JSON.parse(noteDetail.content) : noteDetail.content }
    catch { return null }
  }, [noteDetail?.content])

  return {
    notes,
    selectedNote,
    noteDetail,
    noteDetailLoading,
    parsedContent,
    handleNoteClick: openNote,
  }
}
