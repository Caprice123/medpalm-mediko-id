// V1's tab row is whatever CreateSkripsiSetService built: as many
// `ai_researcher_<n>` chats as the constants ask for, plus the paraphraser and
// the diagram builder.
//
// V2 keeps its own tabs (`ai_chat`, `research`) in the same `skripsi_tabs`
// table, on the same report — so a read that takes every row hands V1 tabs it
// has no panel for. This matches V1's own types rather than excluding V2's, so
// a tab type added to V2 later never leaks in here either.
export const V1_TAB_WHERE = {
  OR: [
    { tab_type: { startsWith: 'ai_researcher_' } },
    { tab_type: { in: ['paraphraser', 'diagram_builder'] } },
  ],
}
