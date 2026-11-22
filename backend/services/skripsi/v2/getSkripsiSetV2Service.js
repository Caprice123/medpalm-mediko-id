import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { findOwnedSet } from '#services/skripsi/v2/skripsiSetOwnership'
import { V2_TAB_TYPES, ensureV2Tabs, sortV2Tabs } from '#services/skripsi/v2/skripsiTabsV2'

// The open report, as the V2 editor needs it. V1's own read service is left
// alone: this one lists only the three V2 panels and creates any the report is
// missing, which is what brings an older report up to date on first open.
//
// Sections and members come with it. Both are needed before the editor can
// draw anything and neither is paged — every section is rendered at once, with
// its own editor — so asking for them separately would only be two more round
// trips to the same report.
//
// Messages are the exception: each tab pages its own in, so inlining them here
// would load every conversation in the report.
export class GetSkripsiSetV2Service extends BaseService {
  static async call({ setId, userId }) {
    const set = await findOwnedSet(setId, userId)

    await ensureV2Tabs(set.id)

    const full = await prisma.skripsi_sets.findUnique({
      where: { id: set.id },
      include: {
        tabs: { where: { tab_type: { in: V2_TAB_TYPES } } },
        sections: { orderBy: [{ position: 'asc' }, { id: 'asc' }] },
        members: { orderBy: [{ position: 'asc' }, { id: 'asc' }] },
      },
    })

    return { ...full, tabs: sortV2Tabs(full.tabs) }
  }
}
