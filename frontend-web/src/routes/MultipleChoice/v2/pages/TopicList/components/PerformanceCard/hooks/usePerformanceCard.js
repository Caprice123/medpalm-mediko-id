import { useState } from 'react'

export function usePerformanceCard(topics) {
  const [chartTopicId, setChartTopicId] = useState(null)

  const attempted = topics.filter(t => t.avgScore != null)
  const chartTopicOptions = [
    { value: 'all', label: 'Semua Topik' },
    ...attempted.map(t => ({ value: t.id, label: t.name })),
  ]
  const chartSelectedOption = chartTopicId
    ? (chartTopicOptions.find(o => o.value === chartTopicId) ?? chartTopicOptions[0])
    : chartTopicOptions[0]

  const handleChartTopicChange = (opt) => {
    setChartTopicId(!opt || opt.value === 'all' ? null : opt.value)
  }

  return {
    chartTopicId,
    setChartTopicId,
    attempted,
    chartTopicOptions,
    chartSelectedOption,
    handleChartTopicChange,
  }
}
