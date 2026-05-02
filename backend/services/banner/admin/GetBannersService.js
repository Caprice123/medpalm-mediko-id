import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetBannersService {
  static async call({ page = 1, perPage = 20, search, isActive } = {}) {
    const pageNum = parseInt(page)
    const perPageNum = parseInt(perPage)
    const skip = (pageNum - 1) * perPageNum

    const where = { is_deleted: false }
    if (isActive !== undefined && isActive !== '') where.is_active = isActive === 'true' || isActive === true
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const banners = await prisma.banners.findMany({
      where,
      skip,
      take: perPageNum + 1,
      orderBy: [{ id: 'desc' }],
    })

    const isLastPage = banners.length <= perPageNum
    const data = isLastPage ? banners : banners.slice(0, perPageNum)

    return {
      data: data,
      pagination: { page: pageNum, perPage: perPageNum, isLastPage },
    }
  }
}
