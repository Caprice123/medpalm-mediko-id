import { useState } from 'react'
import FeaturesList from '../Features/components/FeaturesList'
import FlashcardV2 from './subpages/FlashcardV2'
import SummaryNotesV2 from './subpages/SummaryNotesV2'
import {
  Container,
  LoadingState,
} from '../Features/Features.styles'

const V2_FEATURES = [
  {
    sessionType: 'flashcard_v2',
    name: 'Flashcard V2',
    icon: '🃏',
    description: 'Sistem flashcard Anki-style dengan spaced repetition (again / hard / good / easy)',
    isActive: true,
  },
  {
    sessionType: 'summary_notes_v2',
    name: 'Summary Notes V2',
    icon: '📄',
    description: 'Ringkasan materi dengan navigasi kurikulum berbasis folder/node',
    isActive: true,
  },
  {
    sessionType: 'mcq_v2',
    name: 'MCQ V2',
    icon: '📝',
    description: 'Soal pilihan ganda dengan sistem topik node dan statistik per-topik',
    isActive: false,
  },
]

function FeaturesV2() {
  const [selectedFeature, setSelectedFeature] = useState(null)

  const handleBackToList = () => setSelectedFeature(null)

  const renderFeaturePage = () => {
    switch (selectedFeature.sessionType) {
      case 'flashcard_v2':
        return <FlashcardV2 onBack={handleBackToList} />
      case 'summary_notes_v2':
        return <SummaryNotesV2 onBack={handleBackToList} />
      default:
        return null
    }
  }

  return (
    <Container>
      {!selectedFeature ? (
        <FeaturesList
          features={V2_FEATURES}
          onFeatureClick={setSelectedFeature}
        />
      ) : (
        renderFeaturePage()
      )}
    </Container>
  )
}

export default FeaturesV2
