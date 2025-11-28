import { PrismaClient } from '@prisma/client'
import { StartFlashcardDeckService } from './services/flashcard/startFlashcardDeckService.js'

const prisma = new PrismaClient()

async function testSorting() {
  try {
    console.log('🧪 Testing Card Sorting with Spaced Repetition\n')

    // Show current progress
    const progress = await prisma.user_card_progress.findMany({
      where: { user_id: 1 },
      orderBy: { card_id: 'asc' }
    })

    console.log('📊 Current Progress:')
    progress.forEach(p => {
      console.log(`  Card ${p.card_id}: Correct=${p.times_correct}, Incorrect=${p.times_incorrect}`)
    })

    console.log('\n---\n')

    // Start deck and see card order
    const result = await StartFlashcardDeckService.call({
      flashcardDeckId: 1,
      userId: 1
    })

    console.log('🎴 Card Order Returned by API:')
    result.deck.cards.forEach((card, idx) => {
      const prog = progress.find(p => p.card_id === card.id)
      console.log(`  ${idx + 1}. Card ${card.id}: Correct=${prog?.times_correct || 0}, Incorrect=${prog?.times_incorrect || 0}`)
    })

    console.log('\n📝 Expected Order (by spaced repetition logic):')
    console.log('  Priority 1: More incorrect comes first')
    console.log('  Priority 2: Less correct comes first (among same incorrect)')
    console.log('  Priority 3: Older reviewed comes first')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testSorting()
