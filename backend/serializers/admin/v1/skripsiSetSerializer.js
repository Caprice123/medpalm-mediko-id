export class SkripsiSetSerializer {
  static serialize(set) {
    const tabs = set.skripsi_tabs || set.tabs || []

    return {
      id: set.id,
      title: set.title,
      description: set.description,
      editor_content: set.editor_content,
      user: set.users ? {
        name: set.users.name,
        email: set.users.email
      } : null,
      tabs: tabs.map(tab => ({
        id: tab.id,
        tab_type: tab.tab_type,
        title: tab.tab_label || tab.title,
        messages: (tab.skripsi_messages || tab.messages || []).map(msg => ({
          sender_type: msg.sender_type,
          content: msg.content,
          created_at: msg.created_at
        }))
      }))
    }
  }

  static serializeList(sets) {
    return sets.map(set => this.serialize(set))
  }
}
