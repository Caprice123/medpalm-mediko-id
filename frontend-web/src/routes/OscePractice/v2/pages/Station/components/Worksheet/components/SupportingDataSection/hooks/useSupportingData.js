import { useState, useMemo, useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { saveSessionObservations, fetchSessionDetail } from '@store/oscePractice/userAction'

// A station allows five supporting investigations. The cap is the exam's, not the UI's: part of
// what the rubric marks is choosing the right few.
export const MAX_SELECTIONS = 5

// Choosing the station's supporting investigations, then reading them back.
//
// The choice is one-way — once saved, the results are revealed and the selection is locked, the
// same as a real station where you cannot un-order a test you have seen the result of.
export const useSupportingData = ({ observations, setObservations, setInterpretations }) => {
  const { sessionId } = useParams()
  const dispatch = useDispatch()

  const sessionDetail = useSelector((state) => state.oscePractice.sessionDetail)
  const isSaving = useSelector((state) => state.oscePractice.loading.isSavingSessionObservations)

  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const isLocked = !!sessionDetail?.observationsLocked

  // Keep the page's answer state in step with what the server says was saved, so the rail's
  // mark and the end-of-station submission agree with the panel.
  useEffect(() => {
    if (!isLocked) return

    const saved = sessionDetail?.userAnswer?.observations || []
    setObservations(saved)
    setInterpretations(saved.reduce((acc, observation) => (
      observation.notes ? { ...acc, [observation.snapshotId]: observation.notes } : acc
    ), {}))
  }, [isLocked, sessionDetail, setObservations, setInterpretations])

  // The API groups investigations (Laboratorium, Radiologi, …); the panel needs them grouped
  // too, but filtered by the search box first.
  const groups = useMemo(() => {
    const available = sessionDetail?.availableObservation || []
    const needle = search.trim().toLowerCase()

    return available
      .map((group) => ({
        name: group.groupName || 'Lainnya',
        items: (group.observations || [])
          .filter((item) => !needle || item.name?.toLowerCase().includes(needle))
          .map((item) => ({ ...item, id: item.snapshotId })),
      }))
      .filter((group) => group.items.length > 0)
  }, [sessionDetail, search])

  const toggle = useCallback((id) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((selected) => selected !== id)
      if (current.length >= MAX_SELECTIONS) return current
      return [...current, id]
    })
  }, [])

  const setInterpretation = useCallback((snapshotId, value) => {
    setInterpretations((current) => ({ ...current, [snapshotId]: value }))
  }, [setInterpretations])

  const confirmSave = useCallback(async () => {
    setIsConfirmOpen(false)
    await dispatch(saveSessionObservations(
      sessionId,
      { snapshotIds: selectedIds },
      // Refetching is what reveals the results: the server attaches each investigation's
      // findings and images only once the selection is locked.
      () => dispatch(fetchSessionDetail(sessionId)),
    ))
  }, [dispatch, sessionId, selectedIds])

  return {
    isLocked,
    isSaving,
    search,
    setSearch,
    groups,
    selectedIds,
    toggle,
    observations,
    setInterpretation,
    isConfirmOpen,
    openConfirm: () => setIsConfirmOpen(true),
    closeConfirm: () => setIsConfirmOpen(false),
    confirmSave,
  }
}
