import { useSelector } from 'react-redux'

// Figma repeats one placeholder card four times. Shipping four identical cards
// would read as a bug, so these are the four real selling points — and they
// stay here as the fallback for a database the landing seed has not run on.
const FALLBACK_CARDS = [
  { title: 'Materi yang Terarah', description: 'Materi tersusun sistematis sesuai kurikulum' },
  { title: 'Anatomi 3D Interaktif', description: 'Pelajari struktur tubuh dari berbagai sudut' },
  { title: 'Latihan Terukur', description: 'Quiz dan flashcard dengan pembahasan lengkap' },
  { title: 'Progres Terpantau', description: 'Lacak perkembangan belajarmu setiap hari' },
]

const FALLBACK_HEADING = 'Kenapa MedPal.id?'
const FALLBACK_SUBTITLE = 'Satu platform untuk mendukung perjalanan belajarmu di kedokteran.'

export function useWhyMedPal() {
  const constants = useSelector((state) => state.constant.constants)

  // The card list is editable under Pengaturan Global. A row with no title is
  // dropped rather than rendered as a numbered card with nothing in it.
  let cards = FALLBACK_CARDS
  try {
    const parsed = JSON.parse(constants.home_why_cards || 'null')
    if (Array.isArray(parsed)) {
      const usable = parsed.filter((card) => card?.title)
      if (usable.length > 0) cards = usable
    }
  } catch {
    // Malformed JSON keeps the fallback.
  }

  return {
    heading: constants.home_why_heading || FALLBACK_HEADING,
    subtitle: constants.home_why_subtitle || FALLBACK_SUBTITLE,
    cards,
  }
}
