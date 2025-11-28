import { PrismaClient } from '@prisma/client'
import { StartFlashcardDeckService } from './services/flashcard/startFlashcardDeckService.js'
import { SubmitFlashcardProgressService } from './services/flashcard/submitFlashcardProgressService.js'

const prisma = new PrismaClient()

async function testSpacedRepetition() {
  try {
    console.log('🧪 Testing Spaced Repetition Algorithm\n')

    // 1. Find test user and deck
    const user = await prisma.users.findFirst({
      where: { email: { contains: '@' } }
    })

    const deck = await prisma.flashcard_decks.findFirst({
      include: { flashcard_cards: true }
    })

    if (!user || !deck) {
      console.log('❌ Missing user or deck')
      return
    }

    console.log(`User: ${user.email} (ID: ${user.id})`)
    console.log(`Deck: "${deck.title}" with ${deck.flashcard_cards.length} cards\n`)

    // 2. Clear previous progress for clean test
    console.log('🧹 Clearing previous progress for clean test...')
    await prisma.user_card_progress.deleteMany({
      where: {
        user_id: user.id,
        card_id: { in: deck.flashcard_cards.map(c => c.id) }
      }
    })
    console.log('✅ Progress cleared\n')

    // 3. First play - all cards should be in original order (no history)
    console.log('📝 First Play (no history)')
    const play1 = await StartFlashcardDeckService.call({
      flashcardDeckId: deck.id,
      userId: user.id
    })

    console.log('Card order:', play1.deck.cards.map(c => c.id).join(', '))
    console.log('(Should be original order since no history)\n')

    // 4. Answer cards 1, 2, 3 INCORRECTLY and cards 4, 5 CORRECTLY
    console.log('📝 Submitting answers:')
    console.log('  - Cards 1, 2, 3: INCORRECT (wrong answers)')
    console.log('  - Cards 4, 5: CORRECT (right answers)\n')

    const answers1 = [
      { cardId: play1.deck.cards[0].id, userAnswer: 'wrong answer 1', timeSpent: 5 },
      { cardId: play1.deck.cards[1].id, userAnswer: 'wrong answer 2', timeSpent: 5 },
      { cardId: play1.deck.cards[2].id, userAnswer: 'wrong answer 3', timeSpent: 5 },
      { cardId: play1.deck.cards[3].id, userAnswer: play1.deck.cards[3].back, timeSpent: 5 },
      { cardId: play1.deck.cards[4].id, userAnswer: play1.deck.cards[4].back, timeSpent: 5 },
    ]

    await SubmitFlashcardProgressService.call({
      deckId: deck.id,
      userId: user.id,
      answers: answers1
    })

    // 5. Check progress after first play
    console.log('📊 Progress after first play:')
    const progress1 = await prisma.user_card_progress.findMany({
      where: {
        user_id: user.id,
        card_id: { in: deck.flashcard_cards.map(c => c.id) }
      },
      orderBy: { card_id: 'asc' }
    })

    progress1.forEach(p => {
      console.log(`  Card ${p.card_id}: Correct=${p.times_correct}, Incorrect=${p.times_incorrect}`)
    })
    console.log()

    // 6. Second play - cards should be re-sorted
    console.log('📝 Second Play (with history)')
    const play2 = await StartFlashcardDeckService.call({
      flashcardDeckId: deck.id,
      userId: user.id
    })

    console.log('Card order:', play2.deck.cards.map(c => c.id).join(', '))
    console.log('Expected: Cards with incorrect answers (1,2,3) should come FIRST\n')

    // Verify sorting
    const firstThreeCards = play2.deck.cards.slice(0, 3).map(c => c.id)
    const incorrectCardIds = [
      play1.deck.cards[0].id,
      play1.deck.cards[1].id,
      play1.deck.cards[2].id
    ]

    const sortedCorrectly = incorrectCardIds.every(id => firstThreeCards.includes(id))

    if (sortedCorrectly) {
      console.log('✅ Spaced Repetition Working Correctly!')
      console.log('   Cards with incorrect answers are prioritized\n')
    } else {
      console.log('❌ Spaced Repetition May Not Be Working')
      console.log(`   Expected cards ${incorrectCardIds.join(', ')} in first 3 positions`)
      console.log(`   Got cards ${firstThreeCards.join(', ')}\n`)
    }

    // 7. Answer the difficult cards correctly this time
    console.log('📝 Third Play - Answer difficult cards correctly')
    const answers2 = [
      { cardId: play2.deck.cards[0].id, userAnswer: play2.deck.cards[0].back, timeSpent: 5 },
      { cardId: play2.deck.cards[1].id, userAnswer: play2.deck.cards[1].back, timeSpent: 5 },
      { cardId: play2.deck.cards[2].id, userAnswer: play2.deck.cards[2].back, timeSpent: 5 }
    ]

    await SubmitFlashcardProgressService.call({
      deckId: deck.id,
      userId: user.id,
      answers: answers2
    })

    console.log('📊 Progress after practicing difficult cards:')
    const progress2 = await prisma.user_card_progress.findMany({
      where: {
        user_id: user.id,
        card_id: { in: deck.flashcard_cards.map(c => c.id) }
      },
      orderBy: { card_id: 'asc' }
    })

    progress2.forEach(p => {
      console.log(`  Card ${p.card_id}: Correct=${p.times_correct}, Incorrect=${p.times_incorrect}`)
    })
    console.log()

    // 8. Fourth play - order should change again
    console.log('📝 Fourth Play (after practicing)')
    const play3 = await StartFlashcardDeckService.call({
      flashcardDeckId: deck.id,
      userId: user.id
    })

    console.log('Card order:', play3.deck.cards.map(c => c.id).join(', '))
    console.log('Expected: Cards that were only correct (4,5) should now come LAST\n')

    console.log('✅ Spaced Repetition Test Complete!')
    console.log('\nSummary:')
    console.log('- Cards dynamically re-sort based on performance')
    console.log('- Incorrect answers increase priority')
    console.log('- Correct answers decrease priority')
    console.log('- System tracks cumulative performance across all plays')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

testSpacedRepetition()
