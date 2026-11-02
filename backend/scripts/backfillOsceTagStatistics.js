import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Seeds user_osce_tag_statistics from the OSCE practice sessions that already exist.
//
// Run this AFTER the 20261101000000_add_user_osce_tag_statistics migration and BEFORE enabling
// the finalize hook for a host (see shouldCalculateOscePerformanceStats in
// backend/utils/oscePerformanceStats.js). Enabling it first would leave users with totals that
// only count sessions finalized from that moment on.
//
// Idempotent: every row is rebuilt from the sessions, not incremented, so running it twice gives
// the same numbers. That makes it both the seed and the repair tool — for a finalize whose
// counter write failed (the hook swallows that deliberately), and for a case that was re-tagged
// after its sessions were already counted.
//
// Keyed on the session's tag SNAPSHOT, the same thing the finalize hook increments, and narrowed
// to the 'topic' tag group — a session also carries 'batch' tags, which are not topics.
// DISTINCT guards the one way this fans out wrongly: a session snapshotted twice against the
// same tag would otherwise be counted twice for it.
async function main() {
  try {
    const result = await prisma.$executeRaw`
      INSERT INTO user_osce_tag_statistics (user_id, tag_id, session_count, total_score, max_score, created_at, updated_at)
      SELECT
        user_id,
        tag_id,
        COUNT(*)::int,
        SUM(total_score)::int,
        SUM(max_score)::int,
        NOW(),
        NOW()
      FROM (
        SELECT DISTINCT s.id, s.user_id, ts.tag_id, s.total_score, s.max_score
        FROM osce_sessions s
        JOIN osce_session_tag_snapshots ts ON ts.osce_session_id = s.id
        JOIN tags t ON t.id = ts.tag_id
        JOIN tag_groups tg ON tg.id = t.tag_group_id AND LOWER(tg.name) = 'topic'
        WHERE s.status = 'completed'
          AND s.total_score IS NOT NULL
          AND s.max_score > 0
      ) AS session_tag_pairs
      GROUP BY user_id, tag_id
      ON CONFLICT (user_id, tag_id) DO UPDATE SET
        session_count = EXCLUDED.session_count,
        total_score   = EXCLUDED.total_score,
        max_score     = EXCLUDED.max_score,
        updated_at    = NOW()
    `;

    console.log(`Backfilled user_osce_tag_statistics for ${result} (user, topic tag) pairs`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
