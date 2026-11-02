import { useSelector } from 'react-redux'
import Loading from '@components/common/Loading'
import { colors } from '@config/colors'
import PerformanceChart from '../PerformanceChart'
import { usePerformanceCard } from './hooks/usePerformanceCard'
import {
  PanelCard,
  PanelHeader,
  PanelHeaderLeft,
  PanelSubtitle,
  PanelTitle,
  PanelTitleRow,
  PanelFootnote,
} from './PerformanceCard.styles'

export default function PerformanceCard() {
  usePerformanceCard()
  const { performanceTopics, loading } = useSelector(state => state.oscePractice)

  return (
    <PanelCard>
      <PanelHeader>
        <PanelHeaderLeft>
          <PanelTitleRow>
            <span>📊</span>
            <PanelTitle>Performa per Topik</PanelTitle>
          </PanelTitleRow>
          <PanelSubtitle>
            Rata-rata skor dari latihan yang sudah selesai dinilai.
          </PanelSubtitle>
        </PanelHeaderLeft>
      </PanelHeader>

      {loading.isLoadingPerformance ? (
        <Loading type="oval" size="small" color={colors.osce.primary} text="Memuat performa..." height="236px" />
      ) : (
        <PerformanceChart topics={performanceTopics} />
      )}

      {!loading.isLoadingPerformance && performanceTopics.length > 0 && (
        <PanelFootnote>
          Terlemah di kiri. Skor dihitung dari poin rubrik yang didapat dibanding poin maksimal
          topiknya, jadi bisa dibandingkan antar topik.
        </PanelFootnote>
      )}
    </PanelCard>
  )
}
