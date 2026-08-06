import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$executeRaw`
      INSERT INTO user_node_progress (user_id, node_id, feature_type, again_count, hard_count, good_count, easy_count, updated_at)
      SELECT
        urs.user_id,
        fnr.node_id,
        'flashcard_card',
        COUNT(*) FILTER (WHERE urs.last_rating = 'again'),
        COUNT(*) FILTER (WHERE urs.last_rating = 'hard'),
        COUNT(*) FILTER (WHERE urs.last_rating = 'good'),
        COUNT(*) FILTER (WHERE urs.last_rating = 'easy'),
        NOW()
      FROM user_review_states urs
      JOIN feature_node_records fnr ON fnr.record_type = 'flashcard_card' AND fnr.record_id = urs.record_id
      WHERE urs.record_type = 'flashcard_card'
      GROUP BY urs.user_id, fnr.node_id
      ON CONFLICT (user_id, node_id, feature_type) DO UPDATE SET
        again_count = EXCLUDED.again_count,
        hard_count  = EXCLUDED.hard_count,
        good_count  = EXCLUDED.good_count,
        easy_count  = EXCLUDED.easy_count,
        updated_at  = NOW()
    `;

    console.log(`Backfilled subtopic-level user_node_progress for ${result} (user, subtopic) pairs`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
