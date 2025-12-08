import { useState } from 'react'
import FeaturesList from './components/FeaturesList'
import FeatureConfig from './components/FeatureConfig'
import Exercise from './subpages/Exercise'
import Flashcard from './subpages/Flashcard'
import SummaryNotes from './subpages/SummaryNotes'
import Calculator from './subpages/Calculator'
import AnatomyQuiz from './subpages/AnatomyQuiz'
import {
  Container,
  HeaderSection,
  SectionTitle,
  LoadingState,
  ErrorMessage
} from './Features.styles'

// Mock data for the 7 features
const FEATURES_DATA = [
  {
    id: 2,
    name: 'Latihan Soal',
    description: 'Latihan soal dengan sistem fill-in-the-blank yang dihasilkan AI',
    icon: '✏️',
    cost: 5,
    isActive: true,
    color: '#8b5cf6'
  },
  {
    id: 8,
    name: 'Flashcard Belajar',
    description: 'Belajar dengan sistem flashcard interaktif yang dihasilkan AI',
    icon: '🎴',
    cost: 10,
    isActive: true,
    color: '#06b6d4'
  },
  {
    id: 10,
    name: 'Ringkasan Materi',
    description: 'Ringkasan materi kedokteran yang disusun dengan format mudah dipahami',
    icon: '📝',
    cost: 5,
    isActive: true,
    color: '#10b981'
  },
  {
    id: 11,
    name: 'Kalkulator',
    description: 'Kalkulator medis yang dapat dikonfigurasi dengan formula custom',
    icon: '🧮',
    cost: 0,
    isActive: true,
    color: '#f59e0b'
  },
  {
    id: 12,
    name: 'Quiz Anatomi',
    description: 'Quiz anatomi dengan gambar dan input manual untuk latihan identifikasi struktur',
    icon: '🧠',
    cost: 0,
    isActive: true,
    color: '#6BB9E8'
  }
]

function Features() {
  const [features, setFeatures] = useState(FEATURES_DATA)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature)
  }

  const handleBackToList = () => {
    setSelectedFeature(null)
  }

  const handleUpdateFeature = (featureId, updates) => {
    setFeatures(features.map(f =>
      f.id === featureId ? { ...f, ...updates } : f
    ))
    // TODO: API call to update feature
  }

  if (loading) {
    return <LoadingState>Memuat fitur...</LoadingState>
  }

  const renderFeaturePage = () => {
    // Check if feature has custom subpage
    if (selectedFeature?.id === 2) {
      // Latihan Soal
      return <Exercise onBack={handleBackToList} />
    }

    if (selectedFeature?.id === 8) {
      // Flashcard Belajar
      return <Flashcard onBack={handleBackToList} />
    }

    if (selectedFeature?.id === 10) {
      // Ringkasan Materi
      return <SummaryNotes onBack={handleBackToList} />
    }

    if (selectedFeature?.id === 11) {
      // Kalkulator
      return <Calculator onBack={handleBackToList} />
    }

    if (selectedFeature?.id === 12) {
      // Quiz Anatomi
      return <AnatomyQuiz onBack={handleBackToList} />
    }

    // Default feature config for other features
    return (
      <FeatureConfig
        feature={selectedFeature}
        onBack={handleBackToList}
        onUpdate={handleUpdateFeature}
      />
    )
  }

  return (
    <Container>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!selectedFeature ? (
        <>
          <HeaderSection>
            <SectionTitle>Kelola Fitur</SectionTitle>
          </HeaderSection>
          <FeaturesList
            features={features}
            onFeatureClick={handleFeatureClick}
          />
        </>
      ) : (
        renderFeaturePage()
      )}
    </Container>
  )
}

export default Features
