export class SkripsiSetSerializer {
  static serialize(set) {
    const tabs = set.tabs || []

    return {
      id: set.id,
      title: set.title,
      editorContent: set.editor_content,
      tabs: tabs.map(tab => ({
        id: tab.id,
        tabType: tab.tab_type,
        title: tab.tab_label || tab.title,
        messages: (tab.messages || []).map(msg => ({
          id: msg.id,
          senderType: msg.sender_type,
          content: msg.content,
          createdAt: msg.created_at
        }))
      }))
    }
  }
}
