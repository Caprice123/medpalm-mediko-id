import prisma from '#prisma/client'
import { ValidationError } from '#errors/validationError'

const deleteAdminSkripsiSetService = async (setId) => {
  // Verify the set exists
  const set = await prisma.skripsi_sets.findFirst({
    where: {
      id: setId,
      is_deleted: false
    }
  })

  if (!set) {
    throw new ValidationError('Skripsi set not found')
  }

  // Hard delete for admin (delete all related data)
  // Delete messages first
  await prisma.skripsi_messages.deleteMany({
    where: {
      skripsi_tab: {
        set_id: setId
      }
    }
  })

  // Delete tabs
  await prisma.skripsi_tabs.deleteMany({
    where: {
      set_id: setId
    }
  })

  // Delete the set
  await prisma.skripsi_sets.delete({
    where: {
      id: setId
    }
  })

  return { success: true }
}

export default deleteAdminSkripsiSetService
