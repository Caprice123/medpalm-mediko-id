# Background Jobs with BullMQ

This directory contains the background job processing system using BullMQ and Redis.

## Overview

Background jobs allow expensive operations (like generating embeddings) to run asynchronously without blocking API responses.

## Architecture

```
Client Request → API → Queue Job → Return Response (fast!)
                         ↓
                    Worker Process
                         ↓
                    Process Job (slow)
                         ↓
                    Update Database
```

## Components

### 1. Queues (`jobs/queues/`)
- **summaryNotesQueue.js**: Manages summary notes operations (embeddings, deletions)

### 2. Workers (`jobs/workers/`)
- **summaryNotesWorker.js**: Processes summary notes jobs from the queue

### 3. Configuration
- **config/redis.js**: Redis connection settings
- **config/bullBoard.js**: Monitoring UI setup

## Setup

### Prerequisites

1. **Install Redis**

**macOS:**
```bash
brew install redis
brew services start redis
```

**Ubuntu:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**Windows:**
Download from https://github.com/microsoftarchive/redis/releases

**Docker:**
```bash
docker run -d -p 6379:6379 redis:alpine
```

2. **Environment Variables**

Add to `.env`:
```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Running the System

### Initial Setup (One-time)

**Initialize Vector DB:**
```bash
node scripts/setupVectorDB.js
```

This creates the required collections in ChromaDB/Qdrant. Only needs to be run once.

### Development

**Terminal 1: Start the API server**
```bash
npm run dev
```

**Terminal 2: Start the worker**
```bash
npm run worker:dev
# Or run a specific queue:
node worker.js summaryNotes
```

### Production

**Using PM2 (recommended):**
```bash
# Install PM2
npm install -g pm2

# One-time: Initialize Vector DB
node scripts/setupVectorDB.js

# Start server and workers
pm2 start server.js --name "medpalm-api"
pm2 start worker.js --name "medpalm-worker-summary" -- summaryNotes

# If you have multiple queues, start separate workers:
# pm2 start worker.js --name "medpalm-worker-email" -- email
# pm2 start worker.js --name "medpalm-worker-other" -- otherQueue

# View logs
pm2 logs

# Monitor
pm2 monit
```

**Using Docker Compose:**
```yaml
# docker-compose.yml
services:
  api:
    build: .
    command: npm start
    ports:
      - "5000:5000"
    depends_on:
      - redis

  worker:
    build: .
    command: npm run worker
    depends_on:
      - redis

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

## Monitoring

### Bull Board UI

Access the monitoring dashboard at:
```
http://localhost:5000/admin/queues
```

Features:
- View queued, active, completed, and failed jobs
- Retry failed jobs
- View job details and logs
- Pause/resume queues

## Job Types

### 1. Embed Summary Note

**When triggered:**
- Creating a summary note with `status: 'published'`
- Updating a published summary note
- Changing status from draft → published

**What it does:**
- Chunks the markdown content
- Generates embeddings using Gemini
- Stores in ChromaDB

**Example:**
```javascript
import { queueEmbedSummaryNote } from '#jobs/queues/embeddingQueue'

// Queue the job
await queueEmbedSummaryNote(summaryNoteId)

// Returns immediately, processing happens in background
```

### 2. Delete Summary Note Embedding

**When triggered:**
- Changing status from published → draft
- Deleting a summary note

**What it does:**
- Removes all embeddings for the note from ChromaDB

**Example:**
```javascript
import { queueDeleteSummaryNoteEmbedding } from '#jobs/queues/embeddingQueue'

await queueDeleteSummaryNoteEmbedding(summaryNoteId)
```

## Error Handling

### Automatic Retries

Jobs automatically retry on failure:
- **Attempts**: 3 retries
- **Backoff**: Exponential (2s, 4s, 8s)

### Failed Jobs

View failed jobs in Bull Board:
1. Go to http://localhost:5000/admin/queues
2. Click "Failed" tab
3. View error details
4. Retry manually if needed

### Monitoring Failed Jobs

```javascript
import { embeddingQueue } from '#jobs/queues/embeddingQueue'

// Get failed jobs
const failed = await embeddingQueue.getFailed()

// Retry all failed jobs
for (const job of failed) {
  await job.retry()
}
```

## Performance Tips

### 1. Concurrency

Adjust worker concurrency in `embeddingWorker.js`:
```javascript
const worker = new Worker(EMBEDDING_QUEUE_NAME, processJob, {
  concurrency: 5 // Process 5 jobs at once
})
```

### 2. Rate Limiting

Prevent API throttling:
```javascript
const worker = new Worker(EMBEDDING_QUEUE_NAME, processJob, {
  limiter: {
    max: 10,      // Max 10 jobs
    duration: 1000 // per second
  }
})
```

### 3. Queue Stats

Monitor queue health:
```javascript
import { getQueueStats } from '#jobs/queues/embeddingQueue'

const stats = await getQueueStats()
console.log(stats)
// {
//   waiting: 5,
//   active: 2,
//   completed: 100,
//   failed: 3,
//   delayed: 0
// }
```

## Troubleshooting

### Worker Not Processing Jobs

1. **Check Redis connection:**
```bash
redis-cli ping
# Should return: PONG
```

2. **Check worker is running:**
```bash
ps aux | grep worker.js
```

3. **View worker logs:**
```bash
pm2 logs medpalm-worker
```

### Jobs Stuck in Queue

1. Check Bull Board UI for stalled jobs
2. Restart the worker:
```bash
pm2 restart medpalm-worker
```

### High Memory Usage

1. Reduce job retention:
```javascript
removeOnComplete: {
  age: 3600,  // Keep for 1 hour instead of 24
  count: 100  // Keep last 100 instead of 1000
}
```

2. Increase Redis memory limit in `redis.conf`:
```
maxmemory 256mb
maxmemory-policy allkeys-lru
```

## Adding New Job Types

1. **Define job type in `embeddingQueue.js`:**
```javascript
export const JobTypes = {
  EMBED_SUMMARY_NOTE: 'embed-summary-note',
  NEW_JOB_TYPE: 'new-job-type' // Add here
}
```

2. **Add queue function:**
```javascript
export async function queueNewJob(data) {
  return await embeddingQueue.add(JobTypes.NEW_JOB_TYPE, data)
}
```

3. **Add handler in `embeddingWorker.js`:**
```javascript
async function processJob(job) {
  switch (job.name) {
    case JobTypes.NEW_JOB_TYPE:
      await handleNewJob(job)
      break
    // ...
  }
}

async function handleNewJob(job) {
  // Process the job
}
```

## Resources

- [BullMQ Documentation](https://docs.bullmq.io/)
- [Redis Documentation](https://redis.io/docs/)
- [Bull Board](https://github.com/felixmosh/bull-board)
