import { seedFeatures } from './seeds/features.seed'
import { seedExerciseConstants } from './seeds/exerciseConstants.seed'
import { seedFlashcardConstants } from './seeds/flashcardConstants.seed'
import { seedCalculatorConstants } from './seeds/calculatorConstants.seed'

async function main() {
  console.log('🚀 Starting database seeding...\n')

  try {
    // Run feature seeder
    // await seedFeatures()

    // Run exercise constants seeder
    await seedExerciseConstants()

    // Run flashcard constants seeder
    await seedFlashcardConstants()

    // Run calculator constants seeder
    await seedCalculatorConstants()

    console.log('\n✨ Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    const { default: prisma } = await import('#prisma/client')
    await prisma.$disconnect()
  })
