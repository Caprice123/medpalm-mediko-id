import { createRedisConnection } from '#config/redis'

const redis = createRedisConnection()

const LB_KEY = (id) => `challenge:leaderboard:${id}`
const DATA_KEY = (id) => `challenge:session_data:${id}`

function compositeScore(score) {
  return score
}

function ttlSeconds(endAt) {
  if (!endAt) return 7 * 24 * 3600 // 7-day default
  const diff = Math.floor((new Date(endAt) - Date.now()) / 1000)
  return Math.max(diff + 24 * 3600, 24 * 3600) // end_at + 1-day buffer, min 1 day
}

export class LeaderboardCacheService {
  static async addEntry({ challengeId, scoringType, userId, score, correctCount, totalTimeSec, endAt }) {
    const lbKey = LB_KEY(challengeId)
    const dataKey = DATA_KEY(challengeId)
    const cs = compositeScore(score)
    const payload = JSON.stringify({ score, correctCount, totalTime: totalTimeSec })

    const pipeline = redis.pipeline()
    pipeline.zadd(lbKey, cs, String(userId))
    pipeline.hset(dataKey, String(userId), payload)

    // Set TTL only on first write (if key is new)
    const ttl = ttlSeconds(endAt)
    pipeline.expire(lbKey, ttl, 'NX')
    pipeline.expire(dataKey, ttl, 'NX')

    await pipeline.exec()
  }

  // Returns 1-based rank with tie support: users with identical score+time share the same rank.
  // Uses ZSCORE + ZCOUNT(strictly greater) instead of ZREVRANK so ties resolve to the same number.
  static async getRank({ challengeId, userId }) {
    const lbKey = LB_KEY(challengeId)
    const cs = await redis.zscore(lbKey, String(userId))
    if (cs === null) return null
    const ahead = await redis.zcount(lbKey, `(${cs}`, '+inf')
    return ahead + 1
  }

  // Returns ordered array of { userId, rank, score, correctCount, totalTime } or null if cache is empty.
  // Tied entries (same compositeScore) receive the same rank; the next distinct group skips accordingly.
  static async getLeaderboard({ challengeId, limit = null }) {
    const lbKey = LB_KEY(challengeId)
    const dataKey = DATA_KEY(challengeId)

    const end = limit ? limit - 1 : -1
    // WITHSCORES returns [uid, score, uid, score, ...]
    const raw = await redis.zrevrange(lbKey, 0, end, 'WITHSCORES')
    if (!raw.length) return null

    const entries = []
    for (let i = 0; i < raw.length; i += 2) {
      entries.push({ userId: parseInt(raw[i]), cs: parseFloat(raw[i + 1]) })
    }

    const userIds = entries.map(e => String(e.userId))
    const rawData = await redis.hmget(dataKey, ...userIds)

    let rank = 1
    return entries.map((e, idx) => {
      if (idx > 0 && e.cs !== entries[idx - 1].cs) rank = idx + 1
      const d = rawData[idx] ? JSON.parse(rawData[idx]) : { score: 0, correctCount: 0, totalTime: 0 }
      return { userId: e.userId, rank, ...d }
    })
  }

  // Returns total count in leaderboard
  static async getCount({ challengeId }) {
    return redis.zcard(LB_KEY(challengeId))
  }

  // Warm cache from an array of completed sessions (called on first cache miss)
  static async warmCache({ challengeId, scoringType, endAt, sessions }) {
    if (!sessions.length) return

    const lbKey = LB_KEY(challengeId)
    const dataKey = DATA_KEY(challengeId)
    const ttl = ttlSeconds(endAt)
    const pipeline = redis.pipeline()

    for (const s of sessions) {
      const cs = compositeScore(s.score)
      pipeline.zadd(lbKey, cs, String(s.user_id))
      pipeline.hset(dataKey, String(s.user_id), JSON.stringify({
        score: s.score,
        correctCount: s.correct_count,
        totalTime: s.total_time_seconds,
      }))
    }
    pipeline.expire(lbKey, ttl)
    pipeline.expire(dataKey, ttl)

    await pipeline.exec()
  }

  static async deleteChallenge({ challengeId }) {
    await redis.del(LB_KEY(challengeId), DATA_KEY(challengeId))
  }
}
