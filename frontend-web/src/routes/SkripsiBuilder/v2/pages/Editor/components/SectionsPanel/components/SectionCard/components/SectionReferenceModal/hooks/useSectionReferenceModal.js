import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// The list the picker shows: every other section of this report, in the order
// they appear in the document, narrowed by whatever is typed. A section cannot
// refer to itself, so the one being written in is left out.
export const useSectionReferenceModal = ({ isOpen, currentSectionId }) => {
  const sections = useSelector(state => state.skripsiV2.sections)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (isOpen) setSearch('')
  }, [isOpen])

  const term = search.trim().toLowerCase()

  // Numbered by where it sits in the document rather than by its stored
  // position, so the list still counts 1, 2, 3 whatever the renumbering left
  // behind after an insert or a move.
  const options = sections
    .map((section, index) => ({ ...section, number: index + 1 }))
    .filter(section => section.id !== currentSectionId)
    .filter(section => !term || section.title.toLowerCase().includes(term))

  return {
    options,
    search,
    setSearch: (event) => setSearch(event.target.value),
    // Told apart from "no sections match" so the empty state can say which
    // one it is.
    hasOtherSections: sections.length > 1,
  }
}
