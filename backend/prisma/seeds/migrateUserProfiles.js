/**
 * Migration script: populate user_profiles from latest user_purchases
 *
 * Run: node --experimental-vm-modules backend/prisma/seeds/migrateUserProfiles.js
 * Or via package.json script if configured.
 *
 * - Creates a user_profiles row for every user who has at least one purchase
 * - Copies phone_number + university from their most recent purchase
 * - Sets is_complete = true only if both fields are present
 * - Skips users who already have a profile row
 */

import prisma from '../client.js'

async function run() {
  console.log('Starting user_profiles migration...')

  // All users who have at least one purchase
  const usersWithPurchases = await prisma.user_purchases.findMany({
    distinct: ['user_id'],
    orderBy: { purchase_date: 'desc' },
    select: { user_id: true }
  })

  const userIds = usersWithPurchases.map(r => r.user_id)
  console.log(`Found ${userIds.length} users with purchases`)

  // Existing profiles to skip
  const existingProfiles = await prisma.user_profiles.findMany({
    where: { user_id: { in: userIds } },
    select: { user_id: true }
  })
  const existingIds = new Set(existingProfiles.map(p => p.user_id))
  console.log(`Skipping ${existingIds.size} users who already have a profile`)

  let created = 0
  let skipped = 0

  for (const userId of userIds) {
    if (existingIds.has(userId)) {
      skipped++
      continue
    }

    // Get latest purchase for this user
    const latestPurchase = await prisma.user_purchases.findFirst({
      where: { user_id: userId },
      orderBy: { purchase_date: 'desc' },
      select: { phone_number: true, university: true }
    })

    const phoneNumber = latestPurchase?.phone_number || null
    const university = latestPurchase?.university || null
    const isComplete = !!(phoneNumber && university)

    await prisma.user_profiles.create({
      data: {
        user_id: userId,
        phone_number: phoneNumber,
        university: university,
        is_complete: isComplete,
      }
    })

    created++
  }

  console.log(`Done. Created: ${created}, Skipped: ${skipped}`)
  await prisma.$disconnect()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
