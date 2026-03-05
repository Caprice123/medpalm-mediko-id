import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {
  fetchSkripsiResearchDomains,
  createSkripsiResearchDomain,
  updateSkripsiResearchDomain,
  deleteSkripsiResearchDomain
} from '@store/skripsi/adminAction'

export const useSkripsiResearchDomains = () => {
  const dispatch = useDispatch()
  const [domains, setDomains] = useState([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await dispatch(fetchSkripsiResearchDomains())
      setDomains(data || [])
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  useEffect(() => {
    load()
  }, [load])

  const addDomain = useCallback(async (domain) => {
    await dispatch(createSkripsiResearchDomain(domain))
    await load()
  }, [dispatch, load])

  const toggleDomain = useCallback(async (id, is_active) => {
    await dispatch(updateSkripsiResearchDomain(id, is_active))
    await load()
  }, [dispatch, load])

  const removeDomain = useCallback(async (id) => {
    await dispatch(deleteSkripsiResearchDomain(id))
    await load()
  }, [dispatch, load])

  return { domains, loading, addDomain, toggleDomain, removeDomain }
}
