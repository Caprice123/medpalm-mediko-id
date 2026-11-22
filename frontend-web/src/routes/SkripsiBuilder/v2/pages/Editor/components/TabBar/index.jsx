import { memo } from 'react'
import { TabBar as Bar, Tab } from './TabBar.styles'

// Fallback labels, used only when a tab row carries no title of its own. V2
// serves three panels and no more: a chat, a source searcher, and the diagram
// builder. V1's mode picker inside the chat is gone — the tab is the choice.
const TAB_LABELS = {
  ai_chat: 'AI Chat',
  research: 'Searcher',
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
