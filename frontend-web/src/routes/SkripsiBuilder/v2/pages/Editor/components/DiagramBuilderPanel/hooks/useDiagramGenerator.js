import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { convertToExcalidrawElements } from '@excalidraw/excalidraw'
import { parseMermaidToExcalidraw } from '@excalidraw/mermaid-to-excalidraw'
import { generateDiagram, createDiagram } from '@store/skripsi/v2'
import { actions as commonActions } from '@store/common/reducer'
import { sanitizeMermaid } from '../../../utils/sanitizeMermaid'

export const DETAIL_LEVEL_OPTIONS = [
  { value: 'simple', label: 'Simple - Ringkas' },
  { value: 'medium', label: 'Medium - Sedang' },
  { value: 'detailed', label: 'Detailed - Detail' },
]

export const ORIENTATION_OPTIONS = [
  { value: 'vertical', label: 'Vertikal ↓' },
  { value: 'horizontal', label: 'Horizontal →' },
]

export const LAYOUT_STYLE_OPTIONS = [
  { value: 'branch', label: 'Branch - Bercabang' },
  { value: 'linear', label: 'Linear - Linear' },
  { value: 'tree', label: 'Tree - Pohon' },
]

// The generate form, and turning the model's Mermaid into canvas elements.
export const useDiagramGenerator = ({ tabId, api, onGenerated, onShowPreview }) => {
  const dispatch = useDispatch()
  const isGenerating = useSelector(state => state.skripsiV2.loading.isGeneratingDiagram)

  const [detailLevel, setDetailLevel] = useState(DETAIL_LEVEL_OPTIONS[0])
  const [orientation, setOrientation] = useState(ORIENTATION_OPTIONS[0])
  const [layoutStyle, setLayoutStyle] = useState(LAYOUT_STYLE_OPTIONS[0])
  const [description, setDescription] = useState('')

  const canGenerate = Boolean(description.trim()) && !isGenerating

  const handleGenerate = useCallback(async () => {
    if (!description.trim()) {
      dispatch(commonActions.setError('Mohon isi deskripsi diagram terlebih dahulu'))
      return
    }

    // The canvas has to exist before its scene can be replaced. V1 switched to
    // the preview tab and then waited 100ms hoping the API had appeared; the
    // preview stays mounted here precisely so it is ready.
    if (!api) {
      dispatch(commonActions.setError('Kanvas diagram belum siap. Coba lagi sesaat.'))
      return
    }

    const config = {
      type: 'flowchart',
      detailLevel: detailLevel.value,
      orientation: orientation.value,
      layoutStyle: layoutStyle.value,
      description: description.trim(),
    }

    try {
      const mermaid = await dispatch(generateDiagram(tabId, config))
      if (!mermaid) return

      onShowPreview()

      // Render the model's output as written; only if Mermaid rejects it is the
      // sanitised form tried, so sanitising can never alter a diagram that
      // already parsed.
      const { elements } = await parseMermaidToExcalidraw(mermaid)
        .catch(() => parseMermaidToExcalidraw(sanitizeMermaid(mermaid)))

      const excalidrawElements = convertToExcalidrawElements(elements)
      api.updateScene({ elements: excalidrawElements })

      // Recorded as its own history entry, tagged as generated rather than drawn.
      const saved = await dispatch(createDiagram(
        tabId,
        {
          type: 'excalidraw',
          version: 2,
          source: 'medpalm-mediko',
          elements: excalidrawElements,
          appState: api.getAppState(),
          files: api.getFiles(),
        },
        config,
        'ai_generated',
      ))

      if (saved?.diagramId) onGenerated(saved.diagramId)
    } catch (error) {
      dispatch(commonActions.setError(`Gagal membuat diagram: ${error.message}`))
    }
  }, [description, detailLevel, orientation, layoutStyle, tabId, api, dispatch, onGenerated, onShowPreview])

  return {
    detailLevel,
    setDetailLevel,
    orientation,
    setOrientation,
    layoutStyle,
    setLayoutStyle,
    description,
    setDescription,
    isGenerating,
    canGenerate,
    handleGenerate,
  }
}
