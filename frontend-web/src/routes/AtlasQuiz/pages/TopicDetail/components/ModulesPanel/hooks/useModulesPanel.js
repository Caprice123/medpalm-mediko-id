import { useState } from 'react'

export function useModulesPanel(modules) {
  const [search, setSearch] = useState('')

  const filteredModules = search
    ? modules.filter(m => m.title.toLowerCase().includes(search.toLowerCase()))
    : modules

  return { search, setSearch, filteredModules }
}
