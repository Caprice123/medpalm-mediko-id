import prisma from '../../../prisma/client.js'

const getAdminSkripsiSetTabsService = async (setId) => {
  // First verify the set exists
  const set = await prisma.skripsi_sets.findFirst({
    where: {
      id: setId,
      is_deleted: false
    }
  })

  if (!set) {
    throw new Error('Skripsi set not found')
  }

  // Get all tabs with their messages
  const tabs = await prisma.skripsi_tabs.findMany({
    where: {
      set_id: setId
    },
    include: {
      messages: {
        orderBy: {
          created_at: 'asc'
        },
        select: {
          id: true,
          sender_type: true,
          content: true,
          created_at: true
        }
      }
    },
    orderBy: {
      created_at: 'asc'
    }
  })

  return tabs
}

export default getAdminSkripsiSetTabsService
