import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchDiagramImages, generateDiagramImage } from '@store/skripsi/v2'
import { actions as commonActions } from '@store/common/reducer'

// The chips above the box. Each one is a starting sentence, not a fixed
// prompt: it lands in the textarea so the student can finish it in their own
// words before generating.
export const QUICK_PROMPTS = [
  { label: 'Patofisiologi', text: 'Flowchart patofisiologi ' },
  { label: 'Alur diagnosis', text: 'Diagram alur diagnosis ' },
  { label: 'Tatalaksana', text: 'Diagram alur tatalaksana ' },
  { label: 'Peta konsep', text: 'Peta konsep ' },
]

// The builder's own state: what is being asked for, and which picture is on
// screen. The pictures themselves live in Redux, keyed by tab.
export const useDiagramBuilder = (tabId) => {
  const dispatch = useDispatch()
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (!tabId) return

    setDescription('')
    dispatch(fetchDiagramImages(tabId))
  }, [tabId, dispatch])

  // A chip prefixes the box rather than replacing it, so picking one after
  // typing keeps what was written.
  const applyQuickPrompt = (text) => setDescription(prev => (
    prev.trim() ? `${text}${prev.trim()}` : text
  ))

  const handleGenerate = async () => {
    if (!tabId || !description.trim()) {
      dispatch(commonActions.setError('Tulis dulu diagram yang mau dibuat'))
      return
    }

    await dispatch(generateDiagramImage(tabId, description.trim()))
  }

  return {
    description,
    setDescription: (event) => setDescription(event.target.value),
    applyQuickPrompt,
    canGenerate: Boolean(tabId && description.trim()),
    handleGenerate,
  }
}
