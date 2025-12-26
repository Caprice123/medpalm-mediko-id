import prisma from '../../../prisma/client.js'

const getAdminSkripsiSetService = async (setId) => {
  const set = await prisma.skripsi_sets.findFirst({
    where: {
      id: setId,
      is_deleted: false
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      tabs: {
        orderBy: {
          created_at: 'asc'
        },
        include: {
          messages: {
            orderBy: {
              created_at: 'asc'
            }
          }
        }
      }
    }
  })

  if (!set) {
    throw new Error('Skripsi set not found')
  }

  return {
    ...set,
    user: set.users
  }
}

export default getAdminSkripsiSetService
