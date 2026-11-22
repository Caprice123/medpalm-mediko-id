import { memo } from 'react'
import MessageList from './components/MessageList'
import ContextBar from './components/ContextBar'
import ChatComposer from './components/ChatComposer'
import { useChatPanel } from './hooks/useChatPanel'
import { ChatPanel as Panel, ChatMessages } from './ChatPanel.styles'

const ChatPanel = memo(({ tab, style }) => {
  const {
    tabId,
    isStreaming,
    isInitialLoading,
    isLoadingOlder,
    scrollerRef,
    handleScroll,
    handleSend,
    handleStop,
  } = useChatPanel(tab)

  // V1 opened with a mode picker here, and journal settings behind it. Both
  // are gone: this tab is one plain conversation, and finding sources is the
  // Searcher tab's job. What sits above the composer now is not a mode but a
  // context selection — which parts of the student's own report travel with
  // the next question.
  return (
    <Panel style={style}>
      <ChatMessages ref={scrollerRef} onScroll={handleScroll}>
        <MessageList
          tabId={tabId}
          isLoading={isInitialLoading}
          isLoadingOlder={isLoadingOlder}
          isStreaming={isStreaming}
        />
      </ChatMessages>

      <ContextBar tabId={tabId} />

      <ChatComposer
        // Remounts the composer per tab, so a half-typed message does not
        // follow the student into another conversation.
        key={tabId}
        onSend={handleSend}
        onStop={handleStop}
        isStreaming={isStreaming}
      />
    </Panel>
  )
})

ChatPanel.displayName = 'ChatPanel'

export default ChatPanel
