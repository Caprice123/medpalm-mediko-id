// The keys the OSCE hub's two footnote counters are stored under in `user_feature_statistics`.
//
// One module rather than a const per file, because three places have to agree on these strings
// exactly: the service that increments them at finalize, the hub service that reads them, and
// the backfill script that rebuilds them. A typo in any one of them does not throw — it reads
// as a missing row, which `?? 0` turns into a footnote that quietly says zero. The SQL backfill
// interpolates these same constants for the same reason.
//
// `feature` follows the convention the table already uses elsewhere: the record type the
// statistics belong to ('flashcard_card', 'diagnostic_case').
export const OSCE_STATS_FEATURE = 'osce_session'

// Number of sessions this user has had finalized and marked.
export const OSCE_STAT_COMPLETED_SESSIONS = 'completed_sessions'

// Seconds actually spent in those sessions — the sum of their `time_taken`, which finalize
// already caps at the station's allotted duration.
export const OSCE_STAT_PRACTICE_SECONDS = 'practice_seconds'
