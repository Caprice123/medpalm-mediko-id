import { useState } from 'react'
import { useSelector } from 'react-redux'
import { extractYoutubeId } from '../../../utils/youtube'

export function useFeatureTabs(tabs) {
  // Figma shows the Atlas 3D panel as the opened state.
  const [activeKey, setActiveKey] = useState(tabs[1]?.key ?? tabs[0].key)

  // Read here rather than taking it as a prop: this hook resolves the id, so
  // the raw constants never need to travel through the page component.
  const constants = useSelector((state) => state.constant.constants)

  const activeTab = tabs.find((tab) => tab.key === activeKey) ?? tabs[0]
  const videoId = extractYoutubeId(constants?.[activeTab.youtubeKey])

  return { activeKey, setActiveKey, activeTab, videoId }
}
