import { useEffect, useState } from 'react'
import FeaturesList from './components/FeaturesList'
import FeatureConfig from './components/FeatureConfig'
import Exercise from './subpages/Exercise'
import Flashcard from './subpages/Flashcard'
import SummaryNotes from './subpages/SummaryNotes'
import Calculator from './subpages/Calculator'
import AnatomyQuiz from './subpages/AnatomyQuiz'
import MultipleChoice from './subpages/MultipleChoice'
import Chatbot from './subpages/Chatbot'
import SkripsiBuilder from './subpages/SkripsiBuilder'
import { fetchFeatures } from '@store/feature/action'
import {
  Container,
  HeaderSection,
  SectionTitle,
  LoadingState,
  ErrorMessage
} from './Features.styles'
import { useDispatch, useSelector } from 'react-redux'
import OscePracticeAdminPage from './subpages/OscePractice'

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
        case "chatbot":
            return <Chatbot onBack={handleBackToList} />
        case "skripsi_builder":
            return <SkripsiBuilder onBack={handleBackToList} />
        case "osce_practice":
            return <OscePracticeAdminPage onBack={handleBackToList} />
        default:
            return null
    }
  }

  return (
    <Container>
      {!selectedFeature ? (
          <FeaturesList
            features={features}
            onFeatureClick={handleFeatureClick}
          />
      ) : (
        renderFeaturePage()
      )}
    </Container>
  )
}

export default Features
