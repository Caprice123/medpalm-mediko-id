import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { CUSTOM_TEMPLATE } from '../../../hooks/useCreateReport'

// Whether the grid of cards is showing, and what the collapsed row says in its
// place.
//
// An admin can publish as many templates as they like, so this grid is the one
// part of the page with no upper bound: left open it buries the two steps under
// it however short those steps are. Collapsing on pick is what keeps the page
// from needing to become a three-screen wizard - one step is open at a time
// either way, without a Lanjut button or the loss of the whole-form view.
export const useTemplatePicker = (selectedTemplate) => {
  const templates = useSelector(state => state.skripsiV2.templates)
  const isLoading = useSelector(state => state.skripsiV2.loading.isFetchingTemplates)

  // Reopening is a deliberate act ("Ganti"), so this is held rather than
  // derived from whether something is selected.
  const [isExpanded, setIsExpanded] = useState(true)

  const selectedName = useMemo(() => {
    if (selectedTemplate === CUSTOM_TEMPLATE) return 'Buat sendiri'

    return templates.find(template => template.id === selectedTemplate)?.name || null
  }, [templates, selectedTemplate])

  return {
    templates,
    isLoading,
    // A template deleted while its own card was the chosen one leaves nothing
    // to summarise, so the grid comes back rather than collapsing onto a name
    // that is gone.
    isExpanded: isExpanded || !selectedName,
    selectedName,
    expand: () => setIsExpanded(true),
    collapse: () => setIsExpanded(false),
  }
}
