import { useMemo, useState } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

// Copy of last resort: the real text comes from the
// `skripsi_<mode>_user_information` constants, so an admin can explain the
// modes without a deploy. These only show if the config has not landed yet.
//
// Skripsi has two modes, not the chatbot's three: there is no "normal" mode
// here, because every answer is grounded either in the student's own notes
// (validated) or in retrieved literature (research).
const MODE_DEFS = [
  {
    id: 'validated',
    icon: '📚',
    label: 'Validated',
    fallbackDescription: 'Menggunakan basis pengetahuan yang telah divalidasi. Jawaban lebih akurat dan terverifikasi dari sumber terpercaya.',
  },
  {
    id: 'research',
    icon: '🔍',
    label: 'Research',
    fallbackDescription: 'Pencarian mendalam dengan multiple sumber dan analisis komprehensif. Cocok untuk topik kompleks yang membutuhkan riset detail.',
  },
]

export const useModeSelector = (currentMode) => {
  const availableModes = useSelector(state => state.skripsiV2.availableModes, shallowEqual)
  const costs = useSelector(state => state.skripsiV2.costs, shallowEqual)
  const userInformation = useSelector(state => state.skripsiV2.userInformation, shallowEqual)

  const [openModal, setOpenModal] = useState(null)

  // Every mode, described — the info modal explains both, including one that
  // is currently switched off.
  const allModes = useMemo(() => MODE_DEFS.map(mode => ({
    ...mode,
    description: userInformation?.[mode.id] || mode.fallbackDescription,
  })), [userInformation])

  const modes = useMemo(() => allModes
    .filter(mode => availableModes?.[mode.id])
    .map(mode => ({ ...mode, cost: costs?.[mode.id] ?? 0 })),
  [allModes, availableModes, costs])

  const currentModeInfo = useMemo(
    () => modes.find(mode => mode.id === currentMode) || null,
    [modes, currentMode]
  )

  return {
    modes,
    allModes,
    currentModeInfo,
    openModal,
    showInfoModal: () => setOpenModal('info'),
    showModePicker: () => setOpenModal('modes'),
    closeModal: () => setOpenModal(null),
  }
}
