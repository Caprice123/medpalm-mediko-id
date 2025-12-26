import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { NotFoundError } from '../../errors/notFoundError.js'

export class UpdateTabService extends BaseService {
  static async call({ tabId, userId, editorContent }) {
    // Verify ownership through the set
    const tab = await prisma.skripsi_tabs.findFirst({
      where: {
        id: tabId
      },
      include: {
        skripsi_set: true
      }
    })

    if (!tab || tab.skripsi_set.user_id !== userId) {
      throw new NotFoundError('Tab not found')
    }

    // Update the tab
    const updatedTab = await prisma.skripsi_tabs.update({
      where: { id: tabId },
      data: {
        editor_content: editorContent,
        updated_at: new Date()
      }
    })

    // Also update the set's updated_at
    await prisma.skripsi_sets.update({
      where: { id: tab.set_id },
      data: { updated_at: new Date() }
    })

    return updatedTab
  }
}
