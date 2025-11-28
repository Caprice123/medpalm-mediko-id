import { PrismaClient } from '@prisma/client'
import { StartFlashcardDeckService } from './services/flashcard/startFlashcardDeckService.js'

const prisma = new PrismaClient()

async function testWeightedRandomization() {
  try {
    console.log('🧪 Testing Weighted Randomization for Spaced Repetition\n')

    // Get progress to show weights
    const progress = await prisma.user_card_progress.findMany({
      where: { user_id: 1 },
      orderBy: { card_id: 'asc' }
    })

    console.log('📊 Current Progress & Calculated Weights:')
    progress.forEach(p => {
      const daysSinceReview = (Date.now() - new Date(p.last_reviewed)) / (1000 * 60 * 60 * 24)
      const recencyBonus = Math.min(daysSinceReview / 7, 2)
      const weight = Math.max(
        1,
        1 + (p.times_incorrect * 3) - (p.times_correct * 0.5) + recencyBonus
      )
      console.log(`  Card ${p.card_id}: Correct=${p.times_correct}, Incorrect=${p.times_incorrect}`)
      console.log(`    → Weight: ${weight.toFixed(2)} (higher = more likely to appear early)`)
    })

    console.log('\n---\n')
    console.log('Testing 3 shuffles of the same deck:\n')

    // Test 3 times to show randomization
    for (let i = 1; i <= 3; i++) {
      const result = await StartFlashcardDeckService.call({
        flashcardDeckId: 1,
        userId: 1
      })

      console.log(`Shuffle ${i}: [${result.deck.cards.map(c => c.id).join(', ')}]`)
    }

    console.log('\n📝 Explanation:')
    console.log('  - Cards with more incorrect answers have HIGHER weights')
    console.log('  - Higher weight = MORE likely to appear early (not guaranteed)')
    console.log('  - Each shuffle is different, but difficult cards appear earlier more often')
    console.log('  - This adds variety while still prioritizing review of difficult cards')

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

testWeightedRandomization()
