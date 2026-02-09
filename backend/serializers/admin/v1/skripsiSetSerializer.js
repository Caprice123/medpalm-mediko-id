export class SkripsiSetSerializer {
  static serialize(set) {
    const tabs = set.skripsi_tabs || set.tabs || []

    return {
      id: set.id,
      uniqueId: set.unique_id,
      title: set.title,
      description: set.description,
      editorContent: set.editor_content,
      user: set.users ? {
        name: set.users.name,
        email: set.users.email
      } : null,
      tabs: tabs.map(tab => ({
        id: tab.id,
        tabType: tab.tab_type,
        title: tab.tab_label || tab.title,
        messages: (tab.skripsi_messages || tab.messages || []).map(msg => ({
          senderType: msg.senderType,
          content: msg.content,
          createdAt: msg.createdAt
        }))
      }))
    }
  }

  static serializeList(sets) {
    return sets.map(set => this.serialize(set))
  }
}
