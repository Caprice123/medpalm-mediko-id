import { useEffect, useState } from 'react'
import FeaturesList from './components/FeaturesList'
import FeatureConfig from './components/FeatureConfig'
import Exercise from './subpages/Exercise'
import Flashcard from './subpages/Flashcard'
import SummaryNotes from './subpages/SummaryNotes'
import Calculator from './subpages/Calculator'
import AnatomyQuiz from './subpages/AnatomyQuiz'
import MultipleChoice from './subpages/MultipleChoice'
import { fetchFeatures } from '@store/feature/action'
import {
  Container,
  HeaderSection,
  SectionTitle,
  LoadingState,
  ErrorMessage
} from './Features.styles'
import { useDispatch, useSelector } from 'react-redux'

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
  },
  {
    id: 13,
    name: 'Multiple Choice Quiz',
    description: 'Quiz pilihan ganda dengan mode pembelajaran dan ujian',
    icon: '✅',
    cost: 0,
    isActive: true,
    color: '#ec4899'
  }
]

function Features() {
  const { features, loading } = useSelector(state => state.feature)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchFeatures())
  }, [dispatch])

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature)
  }

  const handleBackToList = () => {
    setSelectedFeature(null)
  }

  if (loading.isLoadingFeatures) {
    return <LoadingState>Memuat fitur...</LoadingState>
  }

  const renderFeaturePage = () => {
    switch (selectedFeature.sessionType) {
        case "exercise":
            return <Exercise onBack={handleBackToList} />
        case "flashcard":
            return <Flashcard onBack={handleBackToList} />
        case "summary_notes":
            return <SummaryNotes onBack={handleBackToList} />
        case "calculator":
            return <Calculator onBack={handleBackToList} />
        case "anatomy":
            return <AnatomyQuiz onBack={handleBackToList} />
        case "mcq":
            return <MultipleChoice onBack={handleBackToList} />
    }
  }

  return (
    <Container>
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
