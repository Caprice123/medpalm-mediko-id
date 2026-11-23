import prisma from '#prisma/client'

// V2 gives every report exactly three panels. V1's tab row — ai_researcher_1/2/3
// plus a paraphraser — stays in the table untouched for the hosts still serving
// V1; V2 simply never lists it.
export const V2_TAB_TYPES = ['ai_chat', 'research', 'diagram_builder']

// The research tab keeps its stored type and is presented as the Searcher:
// renaming the rows would mean a migration for a label.
export const V2_TAB_TITLES = {
  ai_chat: 'AI Chat',
  research: 'Searcher',
  diagram_builder: 'Diagram Builder',
}

// The answer style each chat tab asks for. V1 made this a picker inside the
// chat; V2 has one chat tab and it always answers in normal mode — a plain
// conversation against the `skripsi_ai_researcher_*` prompt and its own
// `pbl_ai_chat_model`, with no retrieval step in front of it. Finding and citing sources is the Searcher's
// job, and the Searcher is not a conversation.
export const V2_CHAT_TAB_MODE_TYPES = {
  ai_chat: 'normal',
}

// What the AI layer should think it is answering for. Both chat tabs run the
// AI-researcher pipeline — the same one V1's tabs run — so its prompts, its
// constants (`skripsi_ai_researcher_*`) and its access checks all apply
// unchanged; only the mode type differs between the two.
export const legacyTabTypeFor = (tabType) => (
  tabType in V2_CHAT_TAB_MODE_TYPES ? 'ai_researcher_1' : tabType
)

// Creates whichever of the three a report is missing. Reports created before
// V2 (or before this tab set) are brought up to date the first time they are
// opened, without touching the tabs V1 reads.
export async function ensureV2Tabs(setId) {
  const existing = await prisma.skripsi_tabs.findMany({
    where: { set_id: setId, tab_type: { in: V2_TAB_TYPES } },
    select: { tab_type: true },
  })

  const present = new Set(existing.map(tab => tab.tab_type))
  const missing = V2_TAB_TYPES.filter(type => !present.has(type))

  if (missing.length === 0) return

  await prisma.skripsi_tabs.createMany({
    data: missing.map(type => ({
      set_id: setId,
      tab_type: type,
      title: V2_TAB_TITLES[type],
      content: '',
    })),
  })
}

// Tabs are ordered by what they are, not by when they were created: a report
// that gained its chat tabs after its diagram tab must still read AI Chat,
// Research, Diagram Builder.
export function sortV2Tabs(tabs) {
  return [...(tabs || [])].sort(
    (a, b) => V2_TAB_TYPES.indexOf(a.tab_type) - V2_TAB_TYPES.indexOf(b.tab_type)
  )
}
