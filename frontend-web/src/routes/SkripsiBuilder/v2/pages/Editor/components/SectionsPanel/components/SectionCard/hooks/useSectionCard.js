import { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { sectionDomId } from '../../../utils/sectionDomId'

// State belonging to one section card: whether its title is being edited, and
// the editor's starting content.
//
// The content passed to the editor is deliberately frozen at mount. The editor
// pushes an external `value` back into itself whenever it differs from what is
// on screen, so feeding it the stored copy — which lags a couple of seconds
// behind while autosave is in flight — would yank the cursor back mid-sentence.
export const useSectionCard = ({ section, onRename, onContentChange }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [draftTitle, setDraftTitle] = useState(section.title)
  const [initialContent, setInitialContent] = useState(section.content || '')

  // The frozen copy above is only ever replaced deliberately. "Kumpulkan
  // referensi" rewrites this section on the server, and the store marks that
  // with a new `contentRevision` — the one signal that the content changed
  // from outside rather than under the student's own cursor. Following
  // `section.content` itself is exactly what would yank the cursor
  // mid-sentence while autosave is in flight.
  const contentRef = useRef(section.content || '')
  contentRef.current = section.content || ''

  // What is actually on screen right now, which the stored copy above is up to
  // an autosave behind. Appending a draft reads this one so a sentence typed a
  // second ago is not thrown away by the paste.
  const liveContentRef = useRef(section.content || '')
  const revision = section.contentRevision ?? 0
  const appliedRevisionRef = useRef(revision)

  // What the assistant was opened with. Null means the modal is closed.
  //
  // Two ways in, and they differ in what comes back. "Edit dengan AI" over a
  // selection hands over that text plus the function that writes a revision
  // back onto it; the ✨ in the header opens with nothing selected and asks
  // for a draft of the whole section instead.
  const [assistRequest, setAssistRequest] = useState(null)

  // Same shape, for the reference picker: holds the function that writes the
  // chosen section into the text at the cursor.
  const [referenceRequest, setReferenceRequest] = useState(null)

  const sections = useSelector(state => state.skripsiV2.sections)

  // A rename from elsewhere (or a failed save rolling back) still has to show.
  useEffect(() => {
    if (!isEditingTitle) setDraftTitle(section.title)
  }, [section.title, isEditingTitle])

  const commitTitle = () => {
    setIsEditingTitle(false)

    const title = draftTitle.trim()
    if (!title || title === section.title) {
      setDraftTitle(section.title)
      return
    }

    onRename(section.id, title)
  }

  const handleTitleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      commitTitle()
    }
    if (event.key === 'Escape') {
      setDraftTitle(section.title)
      setIsEditingTitle(false)
    }
  }

  // What a chip in this editor should be called right now. `null` says the
  // section was deleted, which is what marks the chip broken rather than
  // letting it keep a name nothing answers to.
  const resolveReference = useCallback((refId) => {
    const target = sections.find(section => String(section.id) === String(refId))
    return target ? target.title : null
  }, [sections])

  // Clicking a chip scrolls the referenced card into view. Nothing is
  // highlighted afterwards: the heading landing at the top of the pane is the
  // answer to "where is it".
  const openReference = useCallback((refId) => {
    document.getElementById(sectionDomId(refId))?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [])

  const insertReference = (section) => {
    referenceRequest?.insertReference({ refId: section.id, label: section.title })
    setReferenceRequest(null)
  }

  useEffect(() => {
    if (revision === appliedRevisionRef.current) return

    appliedRevisionRef.current = revision
    liveContentRef.current = contentRef.current
    setInitialContent(contentRef.current)
  }, [revision])

  // A draft lands as content rather than as a selection replacement, so it
  // goes through the same door "Kumpulkan referensi" uses: the editor is given
  // a new starting value, and the change is reported so the section's own
  // autosave writes it. Appending keeps what the student already wrote.
  const handleContentChange = (sectionId, html) => {
    liveContentRef.current = html
    onContentChange(sectionId, html)
  }

  const applyDraft = (html, { replace } = {}) => {
    const current = liveContentRef.current || ''
    const next = replace || !current ? html : `${current}${html}`

    setInitialContent(next)
    appliedRevisionRef.current = revision
    handleContentChange(section.id, next)
  }

  return {
    referenceRequest,
    requestReference: setReferenceRequest,
    closeReferencePicker: () => setReferenceRequest(null),
    insertReference,
    resolveReference,
    openReference,
    assistRequest,
    // The editor's bubble calls this with { text, applyRevision }.
    requestAiEdit: (request) => setAssistRequest({ mode: 'rewrite', ...request }),
    requestDraft: () => setAssistRequest({ mode: 'draft', text: '' }),
    closeAssistant: () => setAssistRequest(null),
    applyAiRevision: (revised) => assistRequest?.applyRevision?.(revised),
    applyDraft,
    handleContentChange,
    isEditingTitle,
    startEditingTitle: () => setIsEditingTitle(true),
    draftTitle,
    setDraftTitle: (event) => setDraftTitle(event.target.value),
    commitTitle,
    handleTitleKeyDown,
    initialContent,
  }
}
