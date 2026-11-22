import { toJakartaISO } from '#utils/dateUtils'
import { SkripsiSectionV2Serializer } from '#serializers/api/v2/skripsiSectionSerializer'
import { SkripsiSetMemberV2Serializer } from '#serializers/api/v2/skripsiSetMemberSerializer'

// One set as the editor needs it: its own fields, the PBL case it is written
// about, the group it belongs to, plus the tab row. Messages are deliberately
// NOT included — each tab pages its own messages in, so inlining them here
// would load every conversation in the set on open.
export class SkripsiSetV2Serializer {
  static serialize(set) {
    return {
      id: set.id,
      uniqueId: set.unique_id,
      title: set.title,
      description: set.description ?? null,
      caseText: set.case_text ?? '',
      editorContent: set.editor_content ?? null,
      templateId: set.template_id ?? null,
      workMode: set.work_mode ?? 'manual',
      createdAt: toJakartaISO(set.created_at),
      updatedAt: toJakartaISO(set.updated_at),
      // Sections and members are only inlined when the caller already loaded
      // them (set creation). The editor reads each from its own route, which
      // is also what every later write refreshes.
      sections: set.sections ? SkripsiSectionV2Serializer.serialize(set.sections) : undefined,
      members: set.members ? SkripsiSetMemberV2Serializer.serialize(set.members) : undefined,
      tabs: (set.tabs || []).map(tab => ({
        id: tab.id,
        tabType: tab.tab_type,
        title: tab.tab_label || tab.title || null,
        updatedAt: toJakartaISO(tab.updated_at),
      })),
    }
  }
}
