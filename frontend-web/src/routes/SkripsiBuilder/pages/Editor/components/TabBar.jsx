import React, { memo } from 'react'
import { TabBar as StyledTabBar, Tab } from '../Editor.styles'

const TAB_CONFIGS = [
  { type: 'ai_researcher_1', title: 'AI Researcher 1' },
  { type: 'ai_researcher_2', title: 'AI Researcher 2' },
  { type: 'ai_researcher_3', title: 'AI Researcher 3' },
  { type: 'paraphraser', title: 'Paraphraser' },
  { type: 'diagram_builder', title: 'Diagram Builder' }
]

const TabBar = memo(({ tabs, currentTabId, onTabSwitch }) => {
  return (
    <StyledTabBar>
      {tabs?.map((tab) => (
        <Tab
          key={tab.id}
          $active={currentTabId === tab.id}
          onClick={() => onTabSwitch(tab)}
        >
          {tab.title || TAB_CONFIGS.find(c => c.type === tab.tabType)?.title}
        </Tab>
      ))}
    </StyledTabBar>
  )
})

TabBar.displayName = 'TabBar'

export default TabBar
