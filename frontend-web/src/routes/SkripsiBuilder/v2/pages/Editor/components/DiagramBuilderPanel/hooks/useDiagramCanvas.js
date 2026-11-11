import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setInterval as setWorkerInterval, clearInterval as clearWorkerInterval } from 'worker-timers'
import { exportToBlob, exportToSvg } from '@excalidraw/excalidraw'
import { createDiagram, updateDiagram } from '@store/skripsi/v2'
import { actions as commonActions } from '@store/common/reducer'

const AUTOSAVE_INTERVAL_MS = 30000
const ZOOM_STEP = 1.2
const ZOOM_MIN = 0.1
const ZOOM_MAX = 30

// The stored canvas format. `source` identifies files this app wrote, so a
// scene opened elsewhere is recognisable.
const sceneEnvelope = (api) => ({
  type: 'excalidraw',
  version: 2,
  source: 'medpalm-mediko',
  elements: api.getSceneElements(),
  appState: api.getAppState(),
  files: api.getFiles(),
})

// Hands the browser a file without leaving a blob URL allocated. The revoke is
// deferred: revoking in the same tick as the click can cancel the download in
// some browsers, which is what V1 did.
const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  link.click()

  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// Owns the Excalidraw canvas: its API handle, zoom, saving and export.
export const useDiagramCanvas = ({ tabId }) => {
  const dispatch = useDispatch()

  const [api, setApi] = useState(null)
  const [zoomPercent, setZoomPercent] = useState(100)
  const [diagramId, setDiagramId] = useState(null)

  // Read by the autosave timer, which must not restart on every edit.
  const isDirtyRef = useRef(false)
  const apiRef = useRef(null)
  const diagramIdRef = useRef(null)

  apiRef.current = api
  diagramIdRef.current = diagramId

  // A different tab is a different diagram.
  useEffect(() => {
    setDiagramId(null)
    isDirtyRef.current = false
  }, [tabId])

  const save = useCallback(async () => {
    const canvas = apiRef.current
    if (!canvas) return

    const elements = canvas.getSceneElements()
    if (!elements?.length) return

    try {
      const scene = sceneEnvelope(canvas)

      if (diagramIdRef.current) {
        await dispatch(updateDiagram(diagramIdRef.current, scene))
      } else {
        // Nothing stored yet — this canvas was drawn by hand rather than
        // generated, so it becomes a new history entry.
        const created = await dispatch(createDiagram(tabId, scene, {}, 'manual'))
        if (created?.diagramId) setDiagramId(created.diagramId)
      }

      isDirtyRef.current = false
    } catch (error) {
      dispatch(commonActions.setError(`Gagal menyimpan diagram: ${error.message}`))
    }
  }, [tabId, dispatch])

  // Autosave. V1 ran this every 5 seconds — despite a comment claiming 30 —
  // and triggered it by synthesising a DOM click on a ref to the save button,
  // which only worked while that button happened to be rendered. This calls
  // the handler.
  useEffect(() => {
    if (!tabId) return

    const timer = setWorkerInterval(() => {
      if (isDirtyRef.current) save()
    }, AUTOSAVE_INTERVAL_MS)

    return () => clearWorkerInterval(timer)
  }, [tabId, save])

  // Excalidraw has no zoom event, so the displayed percentage is read from app
  // state. V1 polled it five times a second for the life of the editor; this
  // reads it on the change callback the canvas already fires.
  const syncZoom = useCallback(() => {
    const canvas = apiRef.current
    if (!canvas) return

    setZoomPercent(Math.round((canvas.getAppState().zoom?.value || 1) * 100))
  }, [])

  const handleChange = useCallback(() => {
    isDirtyRef.current = true
    syncZoom()
  }, [syncZoom])

  const applyZoom = useCallback((next) => {
    const canvas = apiRef.current
    if (!canvas) return

    const clamped = Math.min(Math.max(next, ZOOM_MIN), ZOOM_MAX)
    canvas.updateScene({ appState: { zoom: { value: clamped } } })
    setZoomPercent(Math.round(clamped * 100))
  }, [])

  const currentZoom = () => apiRef.current?.getAppState().zoom?.value || 1

  const exportPng = useCallback(async () => {
    const canvas = apiRef.current
    if (!canvas) return

    try {
      const blob = await exportToBlob({
        elements: canvas.getSceneElements(),
        appState: { ...canvas.getAppState(), exportBackground: true, exportWithDarkMode: false },
        files: canvas.getFiles(),
        mimeType: 'image/png',
        quality: 1,
      })

      downloadBlob(blob, 'diagram.png')
    } catch (error) {
      dispatch(commonActions.setError(`Gagal export PNG: ${error.message}`))
    }
  }, [dispatch])

  const exportSvg = useCallback(async () => {
    const canvas = apiRef.current
    if (!canvas) return

    try {
      const svg = await exportToSvg({
        elements: canvas.getSceneElements(),
        appState: { ...canvas.getAppState(), exportBackground: true, exportWithDarkMode: false },
        files: canvas.getFiles(),
      })

      const markup = new XMLSerializer().serializeToString(svg)
      downloadBlob(new Blob([markup], { type: 'image/svg+xml' }), 'diagram.svg')
    } catch (error) {
      dispatch(commonActions.setError(`Gagal export SVG: ${error.message}`))
    }
  }, [dispatch])

  return {
    api,
    setApi,
    zoomPercent,
    diagramId,
    setDiagramId,
    handleChange,
    save,
    zoomIn: () => applyZoom(currentZoom() * ZOOM_STEP),
    zoomOut: () => applyZoom(currentZoom() / ZOOM_STEP),
    resetZoom: () => applyZoom(1),
    exportPng,
    exportSvg,
  }
}
