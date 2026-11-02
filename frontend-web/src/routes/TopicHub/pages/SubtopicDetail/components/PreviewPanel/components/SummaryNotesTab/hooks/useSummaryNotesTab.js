import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNodePreview } from '@store/featureNodes'
import { fetchSummaryNoteDetailV2 } from '@store/summaryNotes/v2/userAction'

export function useSummaryNotesTab(subtopic) {
  const dispatch = useDispatch()
  const { isFetchingPreview } = useSelector(s => s.featureNodes.loading)
  const { isNoteDetailLoading } = useSelector(s => s.summaryNotesV2.loading)

  // null means "belum dimuat" — only an actual empty array is an empty state,
  // so the panel never flashes "tidak ada catatan" while the fetch is in flight
  const [notes, setNotes] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)
  const [noteDetail, setNoteDetail] = useState(null)

  const openNote = (note) => {
    setSelectedNote(note)
    setNoteDetail(null)
    dispatch(fetchSummaryNoteDetailV2(note.uniqueId)).then(setNoteDetail)
  }

  // a subtopic has at most one summary note, so when there's exactly one,
  // open it directly instead of showing a list to click.
  useEffect(() => {
    if (!subtopic?.id) return
    setNotes(null)
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
    notes: notes ?? [],
    isLoadingNotes: notes === null || isFetchingPreview,
    selectedNote,
    noteDetail,
    noteDetailLoading: isNoteDetailLoading,
    parsedContent,
    handleNoteClick: openNote,
  }
}
