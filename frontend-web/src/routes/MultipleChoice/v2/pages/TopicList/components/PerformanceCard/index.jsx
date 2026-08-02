import Dropdown from '@components/common/Dropdown'
import PerformanceChart from '../PerformanceChart'
import { usePerformanceCard } from './hooks/usePerformanceCard'
import {
  PanelCard, PanelHeader, PanelHeaderLeft, PanelTitleRow, PanelTitle, PanelSubtitle, PanelFilterWrap,
} from './PerformanceCard.styles'
import { useSelector } from 'react-redux'

export default function PerformanceCard({ subtopicsCache, onRequestSubtopics }) {
    const { topics } = useSelector(state => state.mcqNodes)
  const {
    chartTopicId, setChartTopicId,
    attempted, chartTopicOptions, chartSelectedOption, handleChartTopicChange,
  } = usePerformanceCard(topics)

  return (
    <PanelCard>
      <PanelHeader>
        <PanelHeaderLeft>
          <PanelTitleRow>
            <span>📊</span>
            <PanelTitle>Performa per Topik</PanelTitle>
          </PanelTitleRow>
          <PanelSubtitle>Rerata ketepatan jawaban. Klik topik untuk melihat subtopik.</PanelSubtitle>
        </PanelHeaderLeft>
        {attempted.length > 0 && (
          <PanelFilterWrap>
            <Dropdown
              options={chartTopicOptions}
              value={chartSelectedOption}
              onChange={handleChartTopicChange}
              isClearable={false}
              usePortal
              placeholder="Pilih topik..."
            />
          </PanelFilterWrap>
        )}
      </PanelHeader>
      <PerformanceChart
        topics={topics}
        subtopicsCache={subtopicsCache}
        onRequestSubtopics={onRequestSubtopics}
        selectedTopicId={chartTopicId}
        onSelectTopic={setChartTopicId}
      />
    </PanelCard>
  )
}
