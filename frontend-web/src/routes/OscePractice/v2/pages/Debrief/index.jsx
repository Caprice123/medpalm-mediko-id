import { useNavigate } from 'react-router-dom'
import { PiArrowLeft, PiWarningCircle } from 'react-icons/pi'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import { SessionResultSkeleton } from '@components/common/SkeletonCard'
import { OscePracticeRoute } from '@routes/OscePractice/routes'
import DebriefHeader from './components/DebriefHeader'
import RubricPanel from './components/RubricPanel'
import EvidencePanel from './components/EvidencePanel'
import { useDebrief } from './hooks/useDebrief'
import { Page, PageContainer, Board, BackRow } from './Debrief.styles'

// `/osce-practice/session/:sessionId/result`. The same board as the station: the rubric that
// marked it on the left, the evidence it marked on the right. V1 made these six tabs, so the
// mark and the thing it was given for could never be read together.
function Debrief() {
  const navigate = useNavigate()
  const { sessionDetail, loading, error, rubric } = useDebrief()

  const back = () => navigate(OscePracticeRoute.moduleRoute)

  if (loading.isLoadingSessionDetail && !sessionDetail) {
    return (
      <Page>
        <PageContainer fluid="xl">
          <SessionResultSkeleton />
        </PageContainer>
      </Page>
    )
  }

  if (error || !sessionDetail) {
    return (
      <Page>
        <PageContainer fluid="xl">
          <BackRow>
            <Button variant="secondary" onClick={back}>
              <PiArrowLeft size={15} /> Kembali ke papan
            </Button>
          </BackRow>
          <EmptyState
            icon={<PiWarningCircle size={32} />}
            title="Sesi tidak ditemukan"
            description={error || 'Sesi yang kamu cari tidak tersedia lagi.'}
            actionLabel="Kembali ke papan"
            onAction={back}
          />
        </PageContainer>
      </Page>
    )
  }

  return (
    <Page>
      <PageContainer fluid="xl">
        <BackRow>
          <Button variant="secondary" onClick={back}>
            <PiArrowLeft size={15} /> Kembali ke papan
          </Button>
        </BackRow>

        <DebriefHeader session={sessionDetail} rubric={rubric} />

        <Board>
          <RubricPanel rubric={rubric} />
          <EvidencePanel />
        </Board>
      </PageContainer>
    </Page>
  )
}

export default Debrief
