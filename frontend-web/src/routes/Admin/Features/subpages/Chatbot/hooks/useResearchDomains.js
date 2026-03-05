import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {
  fetchResearchDomains,
  createResearchDomain,
  updateResearchDomain,
  deleteResearchDomain
} from '@store/chatbot/adminAction'

export const useResearchDomains = () => {
  const dispatch = useDispatch()
  const [domains, setDomains] = useState([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await dispatch(fetchResearchDomains())
      setDomains(data || [])
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  useEffect(() => {
    load()
  }, [load])

  const addDomain = useCallback(async (domain) => {
    await dispatch(createResearchDomain(domain))
    await load()
  }, [dispatch, load])

  const toggleDomain = useCallback(async (id, is_active) => {
    await dispatch(updateResearchDomain(id, is_active))
    await load()
  }, [dispatch, load])

  const removeDomain = useCallback(async (id) => {
    await dispatch(deleteResearchDomain(id))
    await load()
  }, [dispatch, load])

  return { domains, loading, addDomain, toggleDomain, removeDomain }
}
