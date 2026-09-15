import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserData } from '@utils/authToken'
import { hasTabPermission, hasFeaturePermission } from '@utils/permissionUtils'
import FeaturesList from '../Features/components/FeaturesList'
import FlashcardV2 from './subpages/FlashcardV2'
import SummaryNotesV2 from './subpages/SummaryNotesV2'
import McqV2 from './subpages/McqV2'
import DiagnosticV2 from './subpages/DiagnosticV2'
import AnatomyAtlasV2 from './subpages/AnatomyAtlasV2'
import { fetchAdminFeatures } from '@store/feature/adminAction'
import {
  Container,
  LoadingState,
  ErrorMessage,
} from '../Features/Features.styles'

// routeKey drives which subpage renders below; matchSessionType looks up the
// real feature record (title/description/isActive) configured in Kelola Fitur
// so the two stay in sync instead of duplicating the copy here.
// Order mirrors PERMISSION_TO_FEATURE_CONFIG in backend/services/feature/getAdminFeaturesService.js
// (summaryNotes, anatomy, atlas, ..., mcq, flashcard, diagnostic, ...) so Fitur V2 lists in the same
// relative order as Kelola Fitur.
const V2_FEATURE_DEFS = [
  {
    routeKey: 'summary_notes_v2',
    matchSessionType: 'summary_notes',
    requiredFeaturePermissions: ['summaryNotes'],
    icon: '📄',
    fallbackName: 'Summary Notes V2',
    fallbackDescription: 'Ringkasan materi dengan navigasi kurikulum berbasis folder/node',
  },
  {
    // Combines two separate features (Anatomi + Atlas) into one admin panel,
    // so there's no single real feature record to match against.
    // Visible if the user has either underlying permission — the panel itself
    // splits into anatomy/atlas tabs once opened.
    routeKey: 'anatomy_atlas',
    matchSessionType: null,
    requiredFeaturePermissions: ['anatomy', 'atlas'],
    icon: '🫁',
    fallbackName: 'Anatomi & Atlas 3D',
    fallbackDescription: 'Kelola quiz anatomi dan model Atlas 3D dalam satu panel',
  },
  {
    routeKey: 'mcq_v2',
    matchSessionType: 'mcq',
    requiredFeaturePermissions: ['mcq'],
    icon: '📝',
    fallbackName: 'MCQ V2',
    fallbackDescription: 'Soal pilihan ganda dengan sistem topik node dan statistik per-topik',
  },
  {
    routeKey: 'flashcard_v2',
    matchSessionType: 'flashcard',
    // Backend gates /admin/v2/flashcard* routes with requireFeaturePermission('flashcard') — same key as V1.
    requiredFeaturePermissions: ['flashcard'],
    icon: '🃏',
    fallbackName: 'Flashcard V2',
    fallbackDescription: 'Sistem flashcard Anki-style dengan spaced repetition (again / hard / good / easy)',
  },
  {
    routeKey: 'diagnostic_v2',
    matchSessionType: 'diagnostic',
    requiredFeaturePermissions: ['diagnostic'],
    icon: '🩺',
    fallbackName: 'Diagnostik V2',
    fallbackDescription: 'Bank soal diagnostik dengan SRS Anki-style, vignette klinis, dan gambar radiologi',
  },
]

function FeaturesV2() {
  const [selectedFeature, setSelectedFeature] = useState(null)
  const { features: realFeatures, loading } = useSelector(state => state.feature)
  const { error } = useSelector(state => state.common)
  const dispatch = useDispatch()

  useEffect(() => {
    const user = getUserData()
    if (user && (user.role === 'superadmin' || user.role === 'admin')) {
      dispatch(fetchAdminFeatures())
    }
  }, [dispatch])

  if (!hasTabPermission('features')) {
    return (
      <Container>
        <ErrorMessage>
          Anda tidak memiliki akses ke halaman ini. Hubungi administrator untuk mendapatkan izin akses.
        </ErrorMessage>
      </Container>
    )
  }

  if (loading.isLoadingFeatures) {
    return <LoadingState>Memuat fitur...</LoadingState>
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>
          {error.message || 'Terjadi kesalahan saat memuat fitur'}
        </ErrorMessage>
      </Container>
    )
  }

  const v2Features = V2_FEATURE_DEFS
    .filter(def => def.requiredFeaturePermissions.some(hasFeaturePermission))
    .map(def => {
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
