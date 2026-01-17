import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetPublishedOsceTopicsService extends BaseService {
  static async call() {
    const topics = await prisma.osce_topics.findMany({
      where: {
        status: 'published',
        is_active: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        scenario: true,
        ai_model: true,
        duration_minutes: true,
        created_at: true,
        updated_at: true,
        osce_topic_tags: {
          where: {
            tag: {
              is_active: true,
            },
          },
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                tag_group: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return topics
  }
}
