import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetUnlinkedAtlasModelsService extends BaseService {
  static async call({ page = 1, perPage = 20, search = '' }) {
    page = parseInt(page)
    perPage = parseInt(perPage)
    const skip = (page - 1) * perPage
    const take = perPage + 1

    const linkedRecords = await prisma.feature_node_records.findMany({
      where: { record_type: '3d_atlas' },
      select: { record_id: true },
    })
    const linkedIds = linkedRecords.map(r => r.record_id)

    // Scoped to version 1 on purpose: this list is the v1 → v2 migration inbox, showing
    // legacy models that were never attached to the node tree so an admin can assign
    // them to a module. Version-2 models are born attached and are managed from their
    // module's detail page, so they don't belong in this list.
    const where = { version: 1, is_deleted: false }
    if (linkedIds.length > 0) where.id = { notIn: linkedIds }

    if (search?.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
      ]
    }

    const models = await prisma.atlas_models.findMany({
      where,
      take,
      skip,
      orderBy: { id: 'desc' },
    })

    const isLastPage = models.length <= perPage
    const paginatedModels = models.slice(0, perPage)

    return {
      data: paginatedModels,
      pagination: { page, perPage, isLastPage },
    }
  }
}
