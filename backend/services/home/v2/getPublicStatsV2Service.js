import prisma from '#prisma/client'
import { CONTENT_STAT_KEYS } from '#utils/contentStatsHelper'

// Reads the landing-page statistics.
//
// These used to be live COUNTs. They are now denormalised counters kept in
// `constants` and adjusted by the services that write content, so this is a
// single indexed lookup instead of nine table scans. No TTL cache: one row
// fetch is cheap enough that caching would only make new content take longer
// to appear.
//
// The counters are maintained by hand and can therefore drift. Run
// `node scripts/recountContentStats.js` to rebuild them from the source tables.
export class GetPublicStatsV2Service {
  static async call() {
    const keys = Object.values(CONTENT_STAT_KEYS)

    const rows = await prisma.constants.findMany({
      where: { key: { in: keys } },
      select: { key: true, value: true },
    })

    const byKey = {}
    for (const row of rows) {
      const parsed = Number.parseInt(row.value, 10)
      byKey[row.key] = Number.isFinite(parsed) ? parsed : 0
    }

    // A missing row means the counter has never been backfilled. Treat it as 0
    // so the serializer drops it rather than rendering "NaN+".
    const read = (key) => byKey[key] ?? 0

    return {
      mcqCount: read(CONTENT_STAT_KEYS.mcqQuestion),
      flashcardBasicCount: read(CONTENT_STAT_KEYS.flashcardBasic),
      flashcardClozeCount: read(CONTENT_STAT_KEYS.flashcardCloze),
      summaryNoteCount: read(CONTENT_STAT_KEYS.summaryNote),
      atlas3dCount: read(CONTENT_STAT_KEYS.atlasModel),
      diagnosticCount: read(CONTENT_STAT_KEYS.diagnosticQuestion),
      exerciseCount: read(CONTENT_STAT_KEYS.exerciseQuestion),
      anatomyCount: read(CONTENT_STAT_KEYS.anatomyQuestion),
      memberCount: read(CONTENT_STAT_KEYS.member),
      generatedAt: new Date(),
    }
  }
}
