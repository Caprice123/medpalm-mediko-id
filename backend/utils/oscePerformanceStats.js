// Which frontends have the OSCE performance counters switched on.
//
// The counters are being rolled out on staging first, so the decision is per request rather
// than per deploy: one backend serves both hosts, and the origin is what tells them apart.
// Production keeps deriving the chart straight from osce_sessions (see
// GetOscePerformanceV2Service), which is always correct, so a request from medpal.id simply
// never touches the counter table — nothing to roll back if the rollout is paused.
//
// To release to production, add 'medpal.id' and 'www.medpal.id' here — after the backfill
// script has run, or production users would start from totals that only count sessions
// finalized from that moment on.
const STATS_ENABLED_HOSTS = [
  'dev.medpal.id',
  'medpal.id',
  // Local dev, so the counter path can actually be exercised before it ships.
  'localhost',
  '127.0.0.1',
]

const hostOf = (value) => {
  if (!value) return null
  try {
    return new URL(value).hostname
  } catch {
    return null
  }
}

// True when the caller is a frontend the counters are enabled for. Falls back to the Referer
// when there is no Origin header (same-origin navigations send one but not the other), and
// answers false when neither is present — an unidentified caller is treated as production.
export const shouldCalculateOscePerformanceStats = (req) => {
  const host = hostOf(req?.headers?.origin) || hostOf(req?.headers?.referer)
  if (!host) return false

  return STATS_ENABLED_HOSTS.includes(host)
}
