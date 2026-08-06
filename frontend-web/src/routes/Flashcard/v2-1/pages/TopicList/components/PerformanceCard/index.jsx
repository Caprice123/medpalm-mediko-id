import { useSelector } from 'react-redux'
import Dropdown from '@components/common/Dropdown'
import PerformanceChart from '../PerformanceChart'
import { usePerformanceCard } from './hooks/usePerformanceCard'
import {
  PanelCard, PanelHeader, PanelHeaderLeft, PanelTitleRow, PanelTitle, PanelSubtitle, PanelFilterWrap,
} from './PerformanceCard.styles'

export default function PerformanceCard({ subtopicsCache, onRequestSubtopics }) {
  const { progress } = useSelector(state => state.flashcardNodes)
  const topics = progress?.topics ?? []
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
          <PanelSubtitle>Sebaran rating kartu. Klik topik untuk melihat subtopik.</PanelSubtitle>
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
