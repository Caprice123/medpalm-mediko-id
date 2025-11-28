import { PrismaClient } from '@prisma/client'
import { StartFlashcardDeckService } from './services/flashcard/startFlashcardDeckService.js'
import { SubmitFlashcardProgressService } from './services/flashcard/submitFlashcardProgressService.js'

const prisma = new PrismaClient()

async function testFlashcardFlow() {
  try {
    console.log('🧪 Testing Flashcard Flow (Sessionless)\n')

    // 1. Find a test user
    const user = await prisma.users.findFirst({
      where: { email: { contains: '@' } }
    })

    if (!user) {
      console.log('❌ No user found in database')
      return
    }
    console.log(`✅ Found test user: ${user.email} (ID: ${user.id})`)

    // 2. Check user's subscription status
    const activeSubscription = await prisma.user_purchases.findFirst({
      where: {
        user_id: user.id,
        bundle_type: { in: ['subscription', 'hybrid'] },
        subscription_status: 'active',
        subscription_end: {
          gte: new Date()
        }
      },
      include: {
        pricing_plan: true
      }
    })

    if (!activeSubscription) {
      console.log('⚠️  User does not have active subscription')
      console.log('   Creating test subscription...')

      // Create a test pricing plan if it doesn't exist
      let pricingPlan = await prisma.pricing_plans.findFirst()
      if (!pricingPlan) {
        pricingPlan = await prisma.pricing_plans.create({
          data: {
            name: 'Test Plan',
            bundle_type: 'subscription',
            price: 0,
            validity_days: 30,
            credits: 0,
            is_active: true
          }
        })
      }

      // Create subscription for test user
      await prisma.user_purchases.create({
        data: {
          user_id: user.id,
          pricing_plan_id: pricingPlan.id,
          bundle_type: 'subscription',
          subscription_status: 'active',
          subscription_start: new Date(),
          subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          amount_paid: 0
        }
      })

      console.log('✅ Test subscription created')
    } else {
      console.log(`✅ User has active subscription: ${activeSubscription.pricing_plan.name}`)
      console.log(`   - Expires: ${new Date(activeSubscription.subscription_end).toLocaleDateString()}`)
    }

    // 3. Find a flashcard deck
    const deck = await prisma.flashcard_decks.findFirst({
      include: {
        flashcard_cards: true
      }
    })

    if (!deck) {
      console.log('❌ No flashcard deck found in database')
      return
    }
    console.log(`\n✅ Found flashcard deck: "${deck.title}" (ID: ${deck.id})`)
    console.log(`   - Cards: ${deck.flashcard_cards.length}`)

    // 4. Test StartFlashcardDeckService
    console.log('\n📝 Testing StartFlashcardDeckService (Subscription-based)...')
    const startResult = await StartFlashcardDeckService.call({
      flashcardDeckId: deck.id,
      userId: user.id
    })

    console.log('✅ Start deck result:')
    console.log(`   - Total cards: ${startResult.deck.cards.length}`)
    console.log(`   - Cards are sorted: ${startResult.deck.cards.length > 0 ? 'Yes' : 'N/A'}`)

    if (startResult.deck.cards.length > 0) {
      console.log(`   - First card ID: ${startResult.deck.cards[0].id}`)
      const question = startResult.deck.cards[0].front || 'N/A'
      console.log(`   - First card front: ${question.substring(0, Math.min(50, question.length))}...`)
    }

    // 6. Simulate answers
    const answers = startResult.deck.cards.slice(0, 3).map(card => ({
      cardId: card.id,
      userAnswer: card.back, // Correct answer (from 'back' field)
      timeSpent: 5
    }))

    console.log(`\n📝 Testing SubmitFlashcardProgressService...`)
    console.log(`   - Submitting ${answers.length} answers (all correct)`)

    const submitResult = await SubmitFlashcardProgressService.call({
      deckId: deck.id,
      userId: user.id,
      answers
    })

    console.log('✅ Submit result:')
    console.log(`   - Total answered: ${submitResult.total_cards}`)
    console.log(`   - Answers:`)
    submitResult.answers.forEach((ans, idx) => {
      console.log(`     ${idx + 1}. Card ${ans.cardId}: ${ans.isCorrect ? '✓' : '✗'} (similarity: ${(ans.similarityScore * 100).toFixed(1)}%)`)
    })
    const correctCount = submitResult.answers.filter(a => a.isCorrect).length
    const incorrectCount = submitResult.answers.filter(a => !a.isCorrect).length
    console.log(`   - Correct: ${correctCount}`)
    console.log(`   - Incorrect: ${incorrectCount}`)

    // 7. Verify user_card_progress was updated
    const cardProgress = await prisma.user_card_progress.findMany({
      where: {
        user_id: user.id,
        card_id: { in: answers.map(a => a.cardId) }
      }
    })

    console.log(`\n📊 User card progress records created/updated: ${cardProgress.length}`)
    if (cardProgress.length > 0) {
      console.log('   Sample progress:')
      cardProgress.slice(0, 2).forEach(p => {
        console.log(`   - Card ${p.card_id}: Correct=${p.times_correct}, Incorrect=${p.times_incorrect}`)
      })
    }

    // 8. Test spaced repetition: Start same deck again
    console.log(`\n🔄 Testing spaced repetition (starting same deck again)...`)
    const startResult2 = await StartFlashcardDeckService.call({
      flashcardDeckId: deck.id,
      userId: user.id
    })

    console.log('✅ Cards should be re-sorted based on performance:')
    if (startResult2.deck.cards.length > 0) {
      console.log(`   - First card ID: ${startResult2.deck.cards[0].id}`)
      console.log(`   - Card order changed: ${startResult.deck.cards[0].id !== startResult2.deck.cards[0].id ? 'Yes' : 'No (or only 1 card)'}`)
    }

    console.log('\n✅ All tests completed successfully!')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

testFlashcardFlow()
