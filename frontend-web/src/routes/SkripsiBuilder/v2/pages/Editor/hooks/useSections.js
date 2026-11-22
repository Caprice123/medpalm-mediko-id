import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInterval as setWorkerInterval, clearInterval as clearWorkerInterval } from 'worker-timers'
import {
  createSetSection,
  updateSetSection,
  deleteSetSection,
  reorderSetSections,
} from '@store/skripsi/v2'
import { actions as commonActions } from '@store/common/reducer'
import { exportBlocksToDocx } from '@components/BlockNoteEditor/exportToDocx'
import { htmlToBlocks } from '@utils/blockNoteConversion'

const AUTOSAVE_INTERVAL_MS = 30000
const TYPING_IDLE_MS = 2000
const DEFAULT_SECTION_TITLE = 'Bagian Baru'

// The first section of a new report is its cover, written as ordinary content.
// Its own heading is left out of the export — a cover page does not open with
// the word "Cover" — and reports created before covers existed still get the
// generated one below.
const COVER_SECTION_PATTERN = /cover|sampul|halaman judul/i

// The document, as V2 stores it: an ordered list of sections, each written and
// saved on its own. V1 kept one HTML blob in `editor_content` and saved the
// whole thing on every autosave.
//
// Drafts live here rather than in each card so that "Simpan" at the top, the
// autosave timer and the leave guard can all flush every pending section —
// a card cannot be asked to save after the student has already navigated away.
export const useSections = (currentSet) => {
  const dispatch = useDispatch()
  const sections = useSelector(state => state.skripsiV2.sections)
  const members = useSelector(state => state.skripsiV2.members)
  const isLoadingSections = useSelector(state => state.skripsiV2.loading.isFetchingSections)
  const isCreatingSection = useSelector(state => state.skripsiV2.loading.isCreatingSection)
  const savingSectionIds = useSelector(state => state.skripsiV2.savingSectionIds)

  const [dirtyIds, setDirtyIds] = useState([])

  const draftsRef = useRef({})
  const dirtyRef = useRef([])
  const idleTimersRef = useRef({})

  dirtyRef.current = dirtyIds

  const setId = currentSet?.uniqueId

  // The sections themselves arrive with the set, so opening a report does not
  // ask for them again — this only clears whatever was being typed in the
  // report that was open before.
  useEffect(() => {
    if (!setId) return

    draftsRef.current = {}
    setDirtyIds([])
  }, [setId])

  const flushSection = useCallback(async (sectionId) => {
    const content = draftsRef.current[sectionId]
    if (content === undefined) return

    // A section that was added a moment ago still carries its placeholder id
    // until the server answers. Saving against that id would 404; the draft is
    // left in place and the next idle tick, by which time the real id has
    // arrived, writes it.
    if (typeof sectionId === 'string' && sectionId.startsWith('temp-')) return

    delete draftsRef.current[sectionId]
    setDirtyIds(prev => prev.filter(id => id !== sectionId))

    await dispatch(updateSetSection(sectionId, { content }))
  }, [dispatch])

  const saveAll = useCallback(async () => {
    const pending = Object.keys(draftsRef.current).map(Number)
    await Promise.all(pending.map(sectionId => flushSection(sectionId)))
  }, [flushSection])

  // Each section gets its own idle timer, so a long pause in one card saves
  // that card without waiting on whatever is being typed in another.
  const handleContentChange = useCallback((sectionId, html) => {
    draftsRef.current[sectionId] = html
    setDirtyIds(prev => (prev.includes(sectionId) ? prev : [...prev, sectionId]))

    clearTimeout(idleTimersRef.current[sectionId])
    idleTimersRef.current[sectionId] = setTimeout(() => flushSection(sectionId), TYPING_IDLE_MS)
  }, [flushSection])

  // `worker-timers` because a backgrounded tab throttles ordinary timers to
  // roughly one per second, which would stretch this interval unpredictably —
  // exactly when an unsaved draft is most at risk.
  useEffect(() => {
    if (!setId) return

    const timer = setWorkerInterval(() => {
      if (dirtyRef.current.length > 0) saveAll()
    }, AUTOSAVE_INTERVAL_MS)

    return () => clearWorkerInterval(timer)
  }, [setId, saveAll])

  // The browser's own guard for a tab close or reload, which React Router
  // cannot intercept.
  useEffect(() => {
    if (dirtyIds.length === 0) return

    const warn = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirtyIds.length])

  useEffect(() => () => {
    Object.values(idleTimersRef.current).forEach(clearTimeout)
  }, [])

  // Every structural change below is shown first and sent after. The thunk
  // puts the list back and reports the failure itself, so nothing here waits
  // on the answer — and a rejection is swallowed rather than left to surface
  // as an unhandled promise from a click handler.
  const addSection = useCallback((afterPosition = null) => {
    if (!setId) return

    dispatch(createSetSection(setId, { title: DEFAULT_SECTION_TITLE, afterPosition })).catch(() => {})
  }, [setId, dispatch])

  const renameSection = useCallback((sectionId, title) => (
    dispatch(updateSetSection(sectionId, { title }))
  ), [dispatch])

  const removeSection = useCallback((sectionId) => {
    // A pending draft for a section that is about to disappear must not be
    // written back out by the autosave timer.
    clearTimeout(idleTimersRef.current[sectionId])
    delete draftsRef.current[sectionId]
    setDirtyIds(prev => prev.filter(id => id !== sectionId))

    dispatch(deleteSetSection(sectionId)).catch(() => {})
  }, [dispatch])

  const moveSection = useCallback((sectionId, direction) => {
    if (!setId) return

    const index = sections.findIndex(section => section.id === sectionId)
    const target = index + direction
    if (index === -1 || target < 0 || target >= sections.length) return

    const ordered = sections.map(section => section.id)
    ordered.splice(target, 0, ordered.splice(index, 1)[0])

    dispatch(reorderSetSections(setId, ordered)).catch(() => {})
  }, [setId, sections, dispatch])

  // Dropping one entry of the outline onto another. The whole order is sent,
  // same as the arrows above: the server renumbers from the list it is given,
  // so two moves landing close together cannot leave a gap.
  const reorderSections = useCallback((activeId, overId) => {
    if (!setId || activeId === overId) return

    const from = sections.findIndex(section => section.id === activeId)
    const to = sections.findIndex(section => section.id === overId)
    if (from === -1 || to === -1) return

    const ordered = sections.map(section => section.id)
    ordered.splice(to, 0, ordered.splice(from, 1)[0])

    dispatch(reorderSetSections(setId, ordered)).catch(() => {})
  }, [setId, sections, dispatch])

  // Word export rebuilds the document from the sections: a cover with the
  // report's title and its kelompok, then each section title as a heading. The
  // draft being typed is preferred over the stored copy, so an export never
  // silently drops the last few sentences.
  const exportToWord = useCallback(async () => {
    if (!currentSet) return

    try {
      const hasCoverSection = sections.some(section => COVER_SECTION_PATTERN.test(section.title))

      const generatedCover = hasCoverSection ? '' : [
        `<h1>${currentSet.title}</h1>`,
        members.length > 0 ? '<p><strong>Anggota Kelompok</strong></p>' : '',
        ...members.map(member => (
          `<p>${member.name}${member.studentNumber ? ` — ${member.studentNumber}` : ''}</p>`
        )),
      ].join('')

      const contentOf = (section) => draftsRef.current[section.id] ?? section.content ?? ''

      const html = generatedCover + sections
        .map(section => (COVER_SECTION_PATTERN.test(section.title)
          ? contentOf(section)
          : `<h1>${section.title}</h1>${contentOf(section)}`))
        .join('')

      const blocks = await htmlToBlocks(html)

      await exportBlocksToDocx(blocks, currentSet.title.replace(/[^a-z0-9]/gi, '_'), {
        title: currentSet.title,
        description: currentSet.description || '',
        creator: 'Mediko',
        subject: 'Skripsi',
      })
    } catch (error) {
      dispatch(commonActions.setError(`Gagal mengekspor ke Word: ${error.message}`))
    }
  }, [currentSet, sections, members, dispatch])

  return {
    sections,
    isLoadingSections,
    isCreatingSection,
    isSavingAny: Object.keys(savingSectionIds).length > 0,
    savingSectionIds,
    hasUnsavedChanges: dirtyIds.length > 0,
    handleContentChange,
    save: saveAll,
    addSection,
    renameSection,
    removeSection,
    moveSection,
    reorderSections,
    exportToWord,
  }
}
