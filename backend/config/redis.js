import Redis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()
/**
 * Redis connection configuration for BullMQ
 */

/**
 * Get Redis database number based on environment
 * @returns {number} - Database number
 */
function getRedisDatabase() {
  // Check if explicitly set in env
  if (process.env.REDIS_DB) {
    return parseInt(process.env.REDIS_DB)
  }

  // Default based on environment
  const env = process.env.NODE_ENV || 'development'
  return env === 'development' ? 1 : 0
}

// Redis connection options
export const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  db: getRedisDatabase(),
  username: process.env.REDIS_USERNAME || "",
  password: process.env.REDIS_PASSWORD || "",
  maxRetriesPerRequest: null, // Required for BullMQ
  enableReadyCheck: false, // Required for BullMQ
  retryStrategy: (times) => {
    // Exponential backoff
    const delay = Math.min(times * 50, 2000)
    return delay
  }
}

// Create Redis connection
export const createRedisConnection = () => {
  const redis = new Redis(redisOptions)

  redis.on('connect', () => {
    const dbInfo = redisOptions.db !== undefined ? ` (DB: ${redisOptions.db})` : ''
    const envInfo = process.env.NODE_ENV ? ` [${process.env.NODE_ENV}]` : ''
    console.log(`✓ Redis connected${dbInfo}${envInfo}`)
  })

  redis.on('error', (err) => {
    console.error('Redis connection error:', err)
  })

  return redis
}
