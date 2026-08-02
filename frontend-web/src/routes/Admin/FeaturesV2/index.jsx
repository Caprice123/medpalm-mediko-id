import { useState } from 'react'
import { useSelector } from 'react-redux'
import FeaturesList from '../Features/components/FeaturesList'
import FlashcardV2 from './subpages/FlashcardV2'
import SummaryNotesV2 from './subpages/SummaryNotesV2'
import McqV2 from './subpages/McqV2'
import DiagnosticV2 from './subpages/DiagnosticV2'
import AnatomyAtlasV2 from './subpages/AnatomyAtlasV2'
import {
  Container,
  LoadingState,
} from '../Features/Features.styles'

// routeKey drives which subpage renders below; matchSessionType looks up the
// real feature record (title/description/isActive) configured in Kelola Fitur
// so the two stay in sync instead of duplicating the copy here.
const V2_FEATURE_DEFS = [
  {
    routeKey: 'flashcard_v2',
    matchSessionType: 'flashcard',
    icon: '🃏',
    fallbackName: 'Flashcard V2',
    fallbackDescription: 'Sistem flashcard Anki-style dengan spaced repetition (again / hard / good / easy)',
  },
  {
    routeKey: 'summary_notes_v2',
    matchSessionType: 'summary_notes',
    icon: '📄',
    fallbackName: 'Summary Notes V2',
    fallbackDescription: 'Ringkasan materi dengan navigasi kurikulum berbasis folder/node',
  },
  {
    routeKey: 'mcq_v2',
    matchSessionType: 'mcq',
    icon: '📝',
    fallbackName: 'MCQ V2',
    fallbackDescription: 'Soal pilihan ganda dengan sistem topik node dan statistik per-topik',
  },
  {
    routeKey: 'diagnostic_v2',
    matchSessionType: 'diagnostic',
    icon: '🩺',
    fallbackName: 'Diagnostik V2',
    fallbackDescription: 'Bank soal diagnostik dengan SRS Anki-style, vignette klinis, dan gambar radiologi',
  },
  {
    // Combines two separate features (Anatomi + Atlas) into one admin panel,
    // so there's no single real feature record to match against.
    routeKey: 'anatomy_atlas',
    matchSessionType: null,
    icon: '🫁',
    fallbackName: 'Anatomi & Atlas 3D',
    fallbackDescription: 'Kelola quiz anatomi dan model Atlas 3D dalam satu panel',
  },
]

function FeaturesV2() {
  const [selectedFeature, setSelectedFeature] = useState(null)
  const realFeatures = useSelector(s => s.feature.features)

  const v2Features = V2_FEATURE_DEFS.map(def => {
    const real = def.matchSessionType ? realFeatures.find(f => f.sessionType === def.matchSessionType) : null
    return {
      sessionType: def.routeKey,
      name: real?.name || def.fallbackName,
      description: real?.description || def.fallbackDescription,
      icon: def.icon,
      isActive: real ? real.isActive : true,
    }
  })

  const handleBackToList = () => setSelectedFeature(null)

  const renderFeaturePage = () => {
    switch (selectedFeature.sessionType) {
      case 'flashcard_v2':
        return <FlashcardV2 onBack={handleBackToList} />
      case 'summary_notes_v2':
        return <SummaryNotesV2 onBack={handleBackToList} />
      case 'mcq_v2':
        return <McqV2 onBack={handleBackToList} />
      case 'diagnostic_v2':
        return <DiagnosticV2 onBack={handleBackToList} />
      case 'anatomy_atlas':
        return <AnatomyAtlasV2 onBack={handleBackToList} />
      default:
        return null
    }
  }

  return (
    <Container>
      {!selectedFeature ? (
        <FeaturesList
          features={v2Features}
          onFeatureClick={setSelectedFeature}
        />
      ) : (
        renderFeaturePage()
      )}
    </Container>
  )
}

export default FeaturesV2
