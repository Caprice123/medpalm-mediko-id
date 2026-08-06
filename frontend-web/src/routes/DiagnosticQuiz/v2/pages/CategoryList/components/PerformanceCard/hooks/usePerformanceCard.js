import { useState } from 'react'

export function usePerformanceCard(modules) {
  const [chartModuleId, setChartModuleId] = useState(null)

  const attempted = modules.filter(m => m.counts.again + m.counts.hard + m.counts.good + m.counts.easy > 0)
  const chartModuleOptions = [
    { value: 'all', label: 'Semua Modul' },
    ...attempted.map(m => ({ value: m.nodeId, label: m.nodeName })),
  ]
  const chartSelectedOption = chartModuleId
    ? (chartModuleOptions.find(o => o.value === chartModuleId) ?? chartModuleOptions[0])
    : chartModuleOptions[0]

  const handleChartModuleChange = (opt) => {
    setChartModuleId(!opt || opt.value === 'all' ? null : opt.value)
  }

  return {
    chartModuleId,
    setChartModuleId,
    attempted,
    chartModuleOptions,
    chartSelectedOption,
    handleChartModuleChange,
  }
}
