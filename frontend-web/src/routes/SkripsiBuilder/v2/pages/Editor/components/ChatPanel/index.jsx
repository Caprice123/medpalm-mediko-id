import { memo, useState } from 'react'
import { useSelector } from 'react-redux'
import ModeSelector from './components/ModeSelector'
import ResearchSettingsModal from './components/ResearchSettingsModal'
import MessageList from './components/MessageList'
import ChatComposer from './components/ChatComposer'
import { useChatPanel } from './hooks/useChatPanel'
import { ChatPanel as Panel, ChatMessages } from './ChatPanel.styles'

const ChatPanel = memo(({ tab, style }) => {
  const {
    tabId,
    isAIChatTab,
    currentMode,
    isStreaming,
    isInitialLoading,
    isLoadingOlder,
    scrollerRef,
    handleScroll,
    handleSend,
    handleStop,
    handleModeChange,
  } = useChatPanel(tab)

  // Modal visibility is the one piece of state that stays local by convention.
  const [isResearchSettingsOpen, setIsResearchSettingsOpen] = useState(false)

  // Research settings belong to the set, so the modal needs its id.
  const setUniqueId = useSelector(state => state.skripsiV2.currentSet?.uniqueId)

  return (
    <Panel style={style}>
      {isAIChatTab && (
        <ModeSelector
          currentMode={currentMode}
          onModeChange={handleModeChange}
          // Only research mode reads the journal and year filters.
          onOpenResearchSettings={
            currentMode === 'research' && setUniqueId
              ? () => setIsResearchSettingsOpen(true)
              : undefined
          }
        />
      )}

      <ChatMessages ref={scrollerRef} onScroll={handleScroll}>
        <MessageList
          tabId={tabId}
          isLoading={isInitialLoading}
          isLoadingOlder={isLoadingOlder}
          isStreaming={isStreaming}
        />
      </ChatMessages>

      <ChatComposer
        // Remounts the composer per tab, so a half-typed message does not
        // follow the student into another conversation.
        key={tabId}
        onSend={handleSend}
        onStop={handleStop}
        isStreaming={isStreaming}
      />

      {setUniqueId && (
        <ResearchSettingsModal
          isOpen={isResearchSettingsOpen}
          onClose={() => setIsResearchSettingsOpen(false)}
          setUniqueId={setUniqueId}
        />
      )}
    </Panel>
  )
})

ChatPanel.displayName = 'ChatPanel'

export default ChatPanel
