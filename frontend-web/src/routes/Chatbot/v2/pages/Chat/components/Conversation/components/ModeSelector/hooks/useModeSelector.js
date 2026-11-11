import { useMemo, useState } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

// Copy of last resort: the real text comes from the `chatbot_<mode>_user_information`
// constants, so an admin can explain the modes without a deploy. These only show
// if the bootstrap read has not landed yet.
const MODE_DEFS = [
  {
    id: 'normal',
    icon: '🤖',
    label: 'Normal',
    fallbackDescription: 'Respon cepat dengan AI tanpa pencarian basis data. Cocok untuk pertanyaan umum dan percakapan ringan.',
  },
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
  const availableModes = useSelector(state => state.chatbotV2.availableModes, shallowEqual)
  const costs = useSelector(state => state.chatbotV2.costs, shallowEqual)
  const userInformation = useSelector(state => state.chatbotV2.userInformation, shallowEqual)

  const [openModal, setOpenModal] = useState(null)

  // Every mode, described — the info modal explains all three, including ones
  // currently switched off.
  const allModes = useMemo(() => MODE_DEFS.map(mode => ({
    ...mode,
    description: userInformation?.[mode.id] || mode.fallbackDescription,
  })), [userInformation])

  // Only the modes a student can actually pick right now.
  const modes = useMemo(() => allModes
    .filter(mode => availableModes?.[mode.id])
    .map(mode => ({ ...mode, cost: costs?.[mode.id] ?? 0 })),
  [allModes, availableModes, costs])

  // Every hook above runs unconditionally. V1 computed this one after an early
  // return for the empty case, which breaks the rules of hooks: the hook order
  // changed between renders as soon as the last mode was switched off.
  const currentModeInfo = useMemo(
    () => modes.find(mode => mode.id === currentMode) || null,
    [modes, currentMode]
  )

  return {
    modes,
    allModes,
    currentModeInfo,
    hasResearchMode: Boolean(availableModes?.research),
    openModal,
    showInfoModal: () => setOpenModal('info'),
    showModePicker: () => setOpenModal('modes'),
    showResearchSettings: () => setOpenModal('research'),
    closeModal: () => setOpenModal(null),
  }
}
