import prisma from '#prisma/client'
import { SkripsiMessageSerializer } from '#serializers/api/v1/skripsiMessageSerializer'
import { ValidationError } from '#errors/validationError'

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
        orderBy: { id: 'asc' },
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
    throw new ValidationError('Skripsi set not found')
  }

  // Serialize messages to camelCase format (like chatbot)
  if (set.tabs) {
    set.tabs.forEach(tab => {
      if (tab.messages) {
        tab.messages = SkripsiMessageSerializer.serialize(tab.messages)
      }
    })
  }

  console.log(set.tabs)
  return set
}

export default getAdminSkripsiSetService
