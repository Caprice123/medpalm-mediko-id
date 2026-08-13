// SM-2 spaced repetition algorithm
const MAX_INTERVAL_DAYS = 3650 // 10 years — prevents ease-factor compounding from overflowing Date
const MAX_EASE_FACTOR = 5

export function computeNextReview({ interval, easeFactor, rating }) {
  let newInterval = interval
  let newEaseFactor = easeFactor

  switch (rating) {
    case 'again':
      newInterval = 1
      newEaseFactor = Math.max(1.3, easeFactor - 0.2)
      break
    case 'hard':
      newInterval = Math.max(1, Math.round(interval * 1.2))
      newEaseFactor = Math.max(1.3, easeFactor - 0.15)
      break
    case 'good':
      newInterval = Math.max(1, Math.round(interval * easeFactor))
      break
    case 'easy':
      newInterval = Math.max(1, Math.round(interval * easeFactor * 1.3))
      newEaseFactor = Math.min(MAX_EASE_FACTOR, easeFactor + 0.15)
      break
  }

  newInterval = Math.min(newInterval, MAX_INTERVAL_DAYS)

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + newInterval)

  return { interval: newInterval, easeFactor: newEaseFactor, dueDate }
}
