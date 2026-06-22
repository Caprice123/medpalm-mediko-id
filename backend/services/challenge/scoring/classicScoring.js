export class ClassicScoring {
  // Kahoot-style: speed factor + streak multiplier + special multiplier
  static calculate({ challenge, questionIds, questionMap, answerMap }) {
    const { base_points_per_correct: base, seconds_per_question: secondsPerQ } = challenge

    let totalScore = 0
    let correctCount = 0
    let totalTime = 0
    let streak = 0

    for (const qId of questionIds) {
      const ans = answerMap[qId]
      if (!ans) { streak = 0; continue } // unanswered breaks streak

      totalTime += ans.time_taken_seconds ?? 0

      if (ans.is_correct) {
        correctCount++
        streak++

        const timeTaken  = Math.min(ans.time_taken_seconds, secondsPerQ)
        const speedFactor = 0.5 + 0.5 * ((secondsPerQ - timeTaken) / secondsPerQ)
        const streakMult  = streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1
        const pointMult   = questionMap[qId]?.is_special ? 2 : 1

        totalScore += base * pointMult * speedFactor * streakMult
      } else {
        streak = 0
      }
    }

    return { totalScore: Math.round(totalScore), correctCount, totalTime }
  }
}
