export class SkripsiSetSerializer {
  static serialize(set) {
    const tabs = set.tabs || []

    return {
      id: set.id,
      title: set.title,
      editor_content: set.editor_content,
      tabs: tabs.map(tab => ({
        id: tab.id,
        tab_type: tab.tab_type,
        title: tab.tab_label || tab.title,
        messages: (tab.messages || []).map(msg => ({
          id: msg.id,
          sender_type: msg.sender_type,
          content: msg.content,
          created_at: msg.created_at
        }))
      }))
    }
  }
}
