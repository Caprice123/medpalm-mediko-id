import { memo } from 'react'
import { TabBar as Bar, Tab } from './TabBar.styles'

// Fallback labels, used only when a tab row carries no title of its own. The
// tab set itself comes from the server, since which tabs exist depends on
// which ones are enabled in the constants.
const TAB_LABELS = {
  ai_researcher_1: 'AI Chat 1',
  ai_researcher_2: 'AI Chat 2',
  ai_researcher_3: 'AI Chat 3',
  paraphraser: 'Paraphraser',
  diagram_builder: 'Diagram Builder',
}

const TabBar = memo(({ tabs, activeTabId, onSwitch }) => (
  <Bar>
    {tabs.map((tab) => (
      <Tab
        key={tab.id}
        $active={activeTabId === tab.id}
        onClick={() => onSwitch(tab.id)}
      >
        {tab.title || TAB_LABELS[tab.tabType] || tab.tabType}
      </Tab>
    ))}
  </Bar>
))

TabBar.displayName = 'TabBar'

export default TabBar
