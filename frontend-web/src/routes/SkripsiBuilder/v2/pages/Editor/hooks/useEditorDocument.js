import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInterval as setWorkerInterval, clearInterval as clearWorkerInterval } from 'worker-timers'
import { saveSetContent } from '@store/skripsi/v2'
import { upload } from '@store/common/action'
import { actions as commonActions } from '@store/common/reducer'
import { exportBlocksToDocx } from '@components/BlockNoteEditor/exportToDocx'
import { blocksToHTML, htmlToBlocks } from '@utils/blockNoteConversion'

const AUTOSAVE_INTERVAL_MS = 30000
const EMPTY_DOCUMENT = [{ type: 'paragraph', content: '' }]
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// The document itself: its blocks, whether they differ from what is stored, and
// the three ways it leaves the browser (manual save, autosave, Word export).
//
// Content is stored as HTML and edited as BlockNote blocks, so it is converted
// on the way in and on the way out.
export const useEditorDocument = (currentSet) => {
  const dispatch = useDispatch()
  const isSaving = useSelector(state => state.skripsiV2.loading.isSavingContent)

  const [blocks, setBlocks] = useState(EMPTY_DOCUMENT)
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // The autosave timer must not restart every time a character is typed, so it
  // reads the live values through refs instead of closing over them.
  const blocksRef = useRef(blocks)
  const dirtyRef = useRef(false)

  blocksRef.current = blocks
  dirtyRef.current = hasUnsavedChanges

  const setId = currentSet?.uniqueId

  // Load the stored HTML into blocks whenever a different set opens. Keyed on
  // the set's id rather than the object, which is replaced on every write.
  useEffect(() => {
    if (!currentSet?.id) return

    let cancelled = false

    const load = async () => {
      setIsLoadingContent(true)
      try {
        const parsed = await htmlToBlocks(currentSet.editorContent || '')
        if (cancelled) return

        setBlocks(parsed?.length ? parsed : EMPTY_DOCUMENT)
        setHasUnsavedChanges(false)
      } catch (error) {
        if (!cancelled) {
          dispatch(commonActions.setError(`Gagal memuat konten editor: ${error.message}`))
        }
      } finally {
        if (!cancelled) setIsLoadingContent(false)
      }
    }

    load()

    // A slow parse of the previous set must not land after the next one opens.
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSet?.id, dispatch])

  const handleContentChange = useCallback((nextBlocks) => {
    setBlocks(nextBlocks)
    setHasUnsavedChanges(true)
  }, [])

  const save = useCallback(async () => {
    if (!setId) return

    const html = await blocksToHTML(blocksRef.current)
    await dispatch(saveSetContent(setId, html))
    setHasUnsavedChanges(false)
  }, [setId, dispatch])

  // Autosave. `worker-timers` because a backgrounded tab throttles ordinary
  // timers to roughly one per second, which would stretch this interval
  // unpredictably — exactly when an unsaved draft is most at risk.
  useEffect(() => {
    if (!setId) return

    const timer = setWorkerInterval(() => {
      if (dirtyRef.current) save()
    }, AUTOSAVE_INTERVAL_MS)

    return () => clearWorkerInterval(timer)
  }, [setId, save])

  // The browser's own guard for a tab close or reload, which React Router
  // cannot intercept.
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const warn = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [hasUnsavedChanges])

  // Images are uploaded as blobs and referenced by the blob route, which signs
  // each request — so the URL stored in the document never expires.
  const handleImageUpload = useCallback(async (file) => {
    const result = await dispatch(upload(file, 'skripsi-editor'))
    return result ? `${API_BASE_URL}/api/v1/blobs/${result.blobId}` : undefined
  }, [dispatch])

  const exportToWord = useCallback(async () => {
    if (!currentSet) return

    try {
      await exportBlocksToDocx(blocksRef.current, currentSet.title.replace(/[^a-z0-9]/gi, '_'), {
        title: currentSet.title,
        description: currentSet.description || '',
        creator: 'Mediko',
        subject: 'Skripsi',
      })
    } catch (error) {
      dispatch(commonActions.setError(`Gagal mengekspor ke Word: ${error.message}`))
    }
  }, [currentSet, dispatch])

  return {
    blocks,
    isLoadingContent,
    hasUnsavedChanges,
    isSaving,
    handleContentChange,
    handleImageUpload,
    save,
    exportToWord,
  }
}
