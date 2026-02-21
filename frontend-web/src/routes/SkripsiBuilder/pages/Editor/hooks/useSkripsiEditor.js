import { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@store/store'
import { shallowEqual } from 'react-redux'
import { fetchSet, switchTab, saveSetContent } from '@store/skripsi/userAction'
import { upload } from '@store/common/action'
import { exportBlocksToDocx } from '@components/BlockNoteEditor/exportToDocx'
import { blocksToHTML, htmlToBlocks } from '@utils/blockNoteConversion'
import { setInterval, clearInterval } from 'worker-timers'
import { SkripsiRoute } from '../../../routes'
import { actions as commonActions } from '@store/common/reducer'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const useSkripsiEditor = () => {
  const { setId } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const currentSet = useAppSelector((state) => state.skripsi.currentSet, shallowEqual)
  const currentTab = useAppSelector((state) => state.skripsi.currentTab, shallowEqual)
  const loading = useAppSelector((state) => state.skripsi.loading, shallowEqual)

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [editorContent, setEditorContent] = useState([{ type: 'paragraph', content: '' }])
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [isSavingBeforeLeave, setIsSavingBeforeLeave] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const getInitialPanelSize = () => {
    try {
      const saved = localStorage.getItem('skripsi-chat-panel-width')
      return saved ? parseFloat(saved) : 400
    } catch {
      return 400
    }
  }

  const [chatPanelSize] = useState(getInitialPanelSize)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleImageUpload = useCallback(async (file) => {
    const result = await dispatch(upload(file, 'skripsi-editor'))
    if (result) {
        return `${API_BASE_URL}/api/v1/blobs/${result.blobId}`
    }
  }, [dispatch])

  const handleContentChange = useCallback((blocks) => {
    setEditorContent(blocks)
    setHasUnsavedChanges(true)
  }, [])

  useEffect(() => {
    if (setId) {
      dispatch(fetchSet(setId))
    }
  }, [setId, dispatch])

  useEffect(() => {
    if (!currentSet) return

    const loadContent = async () => {
      setIsLoadingContent(true)
      try {
        const htmlContent = currentSet.editorContent || ''
        const blocks = await htmlToBlocks(htmlContent)
        setEditorContent(blocks)
        setHasUnsavedChanges(false)
      } catch (error) {
        console.error('Failed to load editor content:', error)
      } finally {
        setIsLoadingContent(false)
      }
    }

    loadContent()
  }, [currentSet?.id])

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const tabs = useMemo(() => currentSet?.tabs || [], [currentSet?.tabs])
  const currentTabId = useMemo(() => currentTab?.id, [currentTab?.id])
  const isSavingContent = useMemo(() => loading.isSavingContent, [loading.isSavingContent])

  const handleTabSwitch = (tab) => {
    dispatch(switchTab(tab))
  }

  const handleSave = useCallback(async () => {
    if (!currentSet) return

    const htmlContent = await blocksToHTML(editorContent)
    await dispatch(saveSetContent(currentSet.uniqueId, htmlContent, () => {
        setHasUnsavedChanges(false)
    }))
  }, [currentSet, editorContent, dispatch])

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (hasUnsavedChanges && currentSet) {
        handleSave()
      }
    }, 30000)

    return () => clearInterval(autoSaveInterval)
  }, [hasUnsavedChanges, currentSet, handleSave])

  const handleExportWord = useCallback(async () => {
    if (!currentSet) return

    try {
      const fileName = currentSet.title.replace(/[^a-z0-9]/gi, '_')
      await exportBlocksToDocx(editorContent, fileName, {
        title: currentSet.title,
        description: currentSet.description || '',
        creator: 'Mediko',
        subject: 'Skripsi',
      })
    } catch (error) {
      console.error('Failed to export Word:', error)
      dispatch(commonActions.setError(`Gagal mengekspor ke Word: ${error.message}`))
    }
  }, [currentSet, editorContent, dispatch])

  const handleBackClick = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true)
    } else {
      navigate(SkripsiRoute.moduleRoute)
    }
  }, [hasUnsavedChanges, navigate])

  const handleSaveAndLeave = async () => {
    setIsSavingBeforeLeave(true)
    try {
      await handleSave()
      navigate(SkripsiRoute.moduleRoute)
    } catch (error) {
      console.error('Failed to save before leaving:', error)
      dispatch(commonActions.setError('Gagal menyimpan perubahan'))
    } finally {
      setIsSavingBeforeLeave(false)
      setShowUnsavedDialog(false)
    }
  }

  const handleLeaveWithoutSaving = () => {
    setShowUnsavedDialog(false)
    navigate(SkripsiRoute.moduleRoute)
  }

  const handleCancelNavigation = () => {
    setShowUnsavedDialog(false)
  }

  return {
    currentSet,
    currentTab,
    loading,
    tabs,
    currentTabId,
    isSavingContent,
    hasUnsavedChanges,
    editorContent,
    isLoadingContent,
    showUnsavedDialog,
    isSavingBeforeLeave,
    isMobile,
    chatPanelSize,
    handleImageUpload,
    handleContentChange,
    handleTabSwitch,
    handleSave,
    handleExportWord,
    handleBackClick,
    handleSaveAndLeave,
    handleLeaveWithoutSaving,
    handleCancelNavigation,
  }
}
