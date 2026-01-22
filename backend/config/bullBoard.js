import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ExpressAdapter } from '@bull-board/express'
import { summaryNotesQueue } from '#jobs/queues/summaryNotesQueue'

/**
 * Bull Board Setup
 *
 * Provides a web UI for monitoring job queues
 * Access at: http://localhost:3000/admin/queues
 */

export function setupBullBoard() {
  const serverAdapter = new ExpressAdapter()
  serverAdapter.setBasePath('/admin/queues')

  createBullBoard({
    queues: [
      new BullMQAdapter(summaryNotesQueue)
    ],
    serverAdapter: serverAdapter
  })

  return serverAdapter
}
