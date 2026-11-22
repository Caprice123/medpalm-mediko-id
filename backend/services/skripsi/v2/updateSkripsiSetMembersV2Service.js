import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { findOwnedSet } from '#services/skripsi/v2/skripsiSetOwnership'

const MAX_MEMBERS = 30

// The group is edited as one list, so it is written back as one list: the old
// rows go and the submitted ones take their place. Names are typed in, so a
// member never needs a MedPal account to appear on the report's cover.
export class UpdateSkripsiSetMembersV2Service extends BaseService {
  static async call({ setId, userId, members }) {
    if (!Array.isArray(members)) {
      throw new ValidationError('Daftar anggota tidak valid')
    }

    if (members.length > MAX_MEMBERS) {
      throw new ValidationError(`Anggota kelompok maksimal ${MAX_MEMBERS} orang`)
    }

    const set = await findOwnedSet(setId, userId)

    const clean = members
      .map(member => ({
        name: member.name?.trim(),
        studentNumber: member.studentNumber?.trim() || null,
      }))
      .filter(member => member.name)

    await prisma.$transaction(async (tx) => {
      await tx.skripsi_set_members.deleteMany({ where: { set_id: set.id } })

      if (clean.length > 0) {
        await tx.skripsi_set_members.createMany({
          data: clean.map((member, index) => ({
            set_id: set.id,
            name: member.name,
            student_number: member.studentNumber,
            position: index,
          })),
        })
      }
    })

    return prisma.skripsi_set_members.findMany({
      where: { set_id: set.id },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
    })
  }
}
