import { useState, useCallback } from 'react'

// The two "add an entry" fields. The entries themselves live in the page's answer state,
// because ending the station submits them; only the half-typed line is local.
export const useDiagnosisSection = ({ isPsikiatri, setDiagnosisUtama, setDiagnosisPembanding }) => {
  const [draftPrimary, setDraftPrimary] = useState('')
  const [draftDifferential, setDraftDifferential] = useState('')

  // Psychiatry stations take several primary diagnoses (a multiaxial answer), every other
  // station takes one — so only the psychiatry variant has a list to add to.
  const addPrimary = useCallback(() => {
    const value = draftPrimary.trim()
    if (!value || !isPsikiatri) return

    setDiagnosisUtama((current) => [...current, value])
    setDraftPrimary('')
  }, [draftPrimary, isPsikiatri, setDiagnosisUtama])

  const removePrimary = useCallback((index) => {
    setDiagnosisUtama((current) => current.filter((_, position) => position !== index))
  }, [setDiagnosisUtama])

  const addDifferential = useCallback(() => {
    const value = draftDifferential.trim()
    if (!value) return

    setDiagnosisPembanding((current) => [...current, value])
    setDraftDifferential('')
  }, [draftDifferential, setDiagnosisPembanding])

  const removeDifferential = useCallback((index) => {
    setDiagnosisPembanding((current) => current.filter((_, position) => position !== index))
  }, [setDiagnosisPembanding])

  // Enter adds the entry rather than submitting anything: the worksheet is not a form, and the
  // student is typing with one hand while reading the transcript.
  const onEnter = useCallback((action) => (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      action()
    }
  }, [])

  return {
    draftPrimary, setDraftPrimary,
    draftDifferential, setDraftDifferential,
    addPrimary, removePrimary,
    addDifferential, removeDifferential,
    onEnter,
  }
}
