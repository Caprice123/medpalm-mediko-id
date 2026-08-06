import { useState } from 'react'

export function usePerformanceCard(topics) {
  const [chartTopicId, setChartTopicId] = useState(null)

  const attempted = topics.filter(t => t.counts.again + t.counts.hard + t.counts.good + t.counts.easy > 0)
  const chartTopicOptions = [
    { value: 'all', label: 'Semua Topik' },
    ...attempted.map(t => ({ value: t.nodeId, label: t.nodeName })),
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
