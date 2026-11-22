import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'
import attachmentService from '#services/attachment/attachmentService'

const DEFAULT_LIMIT = 20

// The pictures generated for one tab, newest first. Excalidraw-era rows are
// filtered out: they hold a scene, not an image, and the panel that drew them
// no longer exists.
export class GetSkripsiDiagramImagesV2Service extends BaseService {
  static async call({ tabId, userId, limit = DEFAULT_LIMIT }) {
    const tab = await prisma.skripsi_tabs.findFirst({
      where: { id: parseInt(tabId) },
      include: { skripsi_set: true },
    })

    if (!tab || tab.skripsi_set.user_id !== userId) {
      throw new NotFoundError('Tab tidak ditemukan')
    }

    const diagrams = await prisma.skripsi_diagrams.findMany({
      where: { tab_id: tab.id, diagram_type: 'image' },
      orderBy: { created_at: 'desc' },
      take: limit,
    })

    // One bulk read rather than a signed-URL call per row. The result is a Map
    // keyed by record id.
    const attachments = await attachmentService.getBulkAttachmentsWithUrls(
      diagrams.map(diagram => ({ recordType: 'skripsi_diagram', recordId: diagram.id, name: 'image' }))
    )

    return diagrams.map((diagram) => {
      const attachment = attachments.get(diagram.id)

      return {
        ...diagram,
        // The signed URL is what the panel shows now; the blob id is what the
        // document embeds, since /api/v1/blobs/:id never expires.
        imageUrl: attachment?.url || null,
        blobId: attachment?.blob?.id ?? null,
      }
    })
  }
}
