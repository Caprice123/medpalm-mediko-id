import { toJakartaISO } from '#utils/dateUtils'

// One set as the editor needs it: its own fields, plus the tab row. Messages
// are deliberately NOT included — each tab pages its own messages in, so
// inlining them here would load every conversation in the set on open.
export class SkripsiSetV2Serializer {
  static serialize(set) {
    return {
      id: set.id,
      uniqueId: set.unique_id,
      title: set.title,
      description: set.description ?? null,
      editorContent: set.editor_content ?? null,
      createdAt: toJakartaISO(set.created_at),
      updatedAt: toJakartaISO(set.updated_at),
      tabs: (set.tabs || []).map(tab => ({
        id: tab.id,
        tabType: tab.tab_type,
        title: tab.tab_label || tab.title || null,
        updatedAt: toJakartaISO(tab.updated_at),
      })),
    }
  }
}
