import { useSelector } from 'react-redux'
import Dropdown from '@components/common/Dropdown'
import PerformanceChart from '../PerformanceChart'
import { usePerformanceCard } from './hooks/usePerformanceCard'
import {
  PanelCard, PanelHeader, PanelHeaderLeft, PanelTitleRow, PanelTitle, PanelSubtitle, PanelFilterWrap,
} from './PerformanceCard.styles'

export default function PerformanceCard({ submodulesCache, onRequestSubmodules }) {
  const { progress } = useSelector(state => state.diagnosticNodes)
  // Redux field stays `topics` — see note in diagnosticNodes/userAction.js
  const modules = progress?.topics ?? []
  const {
    chartModuleId, setChartModuleId,
    attempted, chartModuleOptions, chartSelectedOption, handleChartModuleChange,
  } = usePerformanceCard(modules)

  return (
    <PanelCard>
      <PanelHeader>
        <PanelHeaderLeft>
          <PanelTitleRow>
            <span>📊</span>
            <PanelTitle>Performa per Modul</PanelTitle>
          </PanelTitleRow>
          <PanelSubtitle>Sebaran rating soal. Klik modul untuk melihat submodul.</PanelSubtitle>
        </PanelHeaderLeft>
        {attempted.length > 0 && (
          <PanelFilterWrap>
            <Dropdown
              options={chartModuleOptions}
              value={chartSelectedOption}
              onChange={handleChartModuleChange}
              isClearable={false}
              usePortal
              placeholder="Pilih modul..."
            />
          </PanelFilterWrap>
        )}
      </PanelHeader>
      <PerformanceChart
        modules={modules}
        submodulesCache={submodulesCache}
        onRequestSubmodules={onRequestSubmodules}
        selectedModuleId={chartModuleId}
        onSelectModule={setChartModuleId}
      />
    </PanelCard>
  )
}
