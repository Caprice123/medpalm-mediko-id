import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserSummaryNoteDetail } from '@store/summaryNotes/userAction'
import { markdownToBlocks } from '@utils/markdownToBlocks'
import { SummaryNotesRoute } from '../../../routes'

export const useSummaryNotesDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { detail: note, loading } = useSelector(state => state.summaryNotes)
  const [parsedContent, setParsedContent] = useState(null)
  const [activeResourceType, setActiveResourceType] = useState('flashcards')

  useEffect(() => {
    if (id) {
      dispatch(fetchUserSummaryNoteDetail(id))
    }
  }, [id, dispatch])

  useEffect(() => {
    async function parseContent() {
      if (note?.content) {
        try {
          const parsed = JSON.parse(note.content)
          if (Array.isArray(parsed)) {
            setParsedContent(parsed)
          }
        } catch {
          const blocks = await markdownToBlocks(note.content)
          setParsedContent(blocks)
        }
      }
    }
    parseContent()
  }, [note])

  const handleBack = () => {
    navigate(SummaryNotesRoute.moduleRoute)
  }

  return {
    note, loading,
    parsedContent,
    activeResourceType, setActiveResourceType,
    handleBack,
  }
}
