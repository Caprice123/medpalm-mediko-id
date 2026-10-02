/**
 * One-time cleanup: strip journal names from saved settings that don't
 * resolve to a real OpenAlex journal/conference (e.g. free-typed custom
 * entries like "MDPI" or a typo). These entries already do nothing at chat
 * time — OpenAlexService silently skips them when building the filter — so
 * removing them doesn't change search behavior, it just cleans up the
 * saved list (and avoids the new "unverified" flag in the settings UI
 * permanently flagging dead entries from before the OpenAlex picker).
 *
 * Covers both:
 *   - user_chatbot_settings.selected_journals (Chatbot research mode)
 *   - skripsi_set_settings.selected_journals  (Skripsi AI Researcher mode)
 *
 * Dry-run by default — only prints what would change.
 * Pass --apply to actually write the updates.
 *
 * Usage:
 *   node scripts/cleanupUnresolvableJournalNames.js          # dry run
 *   node scripts/cleanupUnresolvableJournalNames.js --apply  # write changes
 */

import prisma from '#prisma/client'
import { OpenAlexService } from '#services/ai/openAlex.service'

const APPLY = process.argv.includes('--apply')

async function resolveList(names) {
  const list = Array.isArray(names) ? names : []
  const kept = []
  const removed = []

  for (const name of list) {
    const candidate = await OpenAlexService.resolveSourceCandidate(name)
    if (candidate) kept.push(name)
    else removed.push(name)
  }

  return { kept, removed }
}

async function cleanupChatbot() {
  const rows = await prisma.user_chatbot_settings.findMany({
    where: { selected_journals: { not: [] } },
    include: { user: { select: { email: true } } }
  })

  console.log(`\n[Chatbot] ${rows.length} user_chatbot_settings row(s) with journals selected.\n`)

  let updatedCount = 0
  let removedTotal = 0

  for (const row of rows) {
    const { kept, removed } = await resolveList(row.selected_journals)
    if (removed.length === 0) continue

    console.log(`[Chatbot] ${row.user?.email ?? `user#${row.user_id}`}`)
    console.log(`  removing unresolvable: ${JSON.stringify(removed)}`)
    console.log(`  keeping: ${JSON.stringify(kept)}`)

    if (APPLY) {
      await prisma.user_chatbot_settings.update({
        where: { id: row.id },
        data: { selected_journals: kept, updated_at: new Date() }
      })
      console.log('  ✓ updated')
    }

    updatedCount++
    removedTotal += removed.length
    console.log()
  }

  console.log(`[Chatbot] ${updatedCount} row(s) ${APPLY ? 'updated' : 'would be updated'}, ${removedTotal} entries ${APPLY ? 'removed' : 'would be removed'}.`)
}

async function cleanupSkripsi() {
  const rows = await prisma.skripsi_set_settings.findMany({
    where: { selected_journals: { not: [] } },
    include: { skripsi_set: { select: { id: true, user_id: true } } }
  })

  console.log(`\n[Skripsi] ${rows.length} skripsi_set_settings row(s) with journals selected.\n`)

  let updatedCount = 0
  let removedTotal = 0

  for (const row of rows) {
    const { kept, removed } = await resolveList(row.selected_journals)
    if (removed.length === 0) continue

    console.log(`[Skripsi] set#${row.set_id} (user#${row.skripsi_set?.user_id ?? '?'})`)
    console.log(`  removing unresolvable: ${JSON.stringify(removed)}`)
    console.log(`  keeping: ${JSON.stringify(kept)}`)

    if (APPLY) {
      await prisma.skripsi_set_settings.update({
        where: { id: row.id },
        data: { selected_journals: kept, updated_at: new Date() }
      })
      console.log('  ✓ updated')
    }

    updatedCount++
    removedTotal += removed.length
    console.log()
  }

  console.log(`[Skripsi] ${updatedCount} row(s) ${APPLY ? 'updated' : 'would be updated'}, ${removedTotal} entries ${APPLY ? 'removed' : 'would be removed'}.`)
}

async function run() {
  console.log(APPLY ? 'Running in APPLY mode — changes will be written.' : 'Running in DRY-RUN mode — no changes will be written. Pass --apply to write.')

  await cleanupChatbot()
  await cleanupSkripsi()
}

run()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
