import { useState } from 'react'
import { useSelector } from 'react-redux'

export function useModulesPanel() {
  const [search, setSearch] = useState('')
  const modules = useSelector(s => s.atlasQuiz.topicModules)

  const filteredModules = search
    ? modules.filter(m => m.title.toLowerCase().includes(search.toLowerCase()))
    : modules

  return { search, setSearch, filteredModules }
}
