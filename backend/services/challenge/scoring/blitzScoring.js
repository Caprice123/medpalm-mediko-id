export class BlitzScoring {
  // Count-based: regular correct = 1 pt, special correct = 2 pts
  static calculate({ questionIds, questionMap, answerMap }) {
    let totalScore = 0
    let correctCount = 0
    let totalTime = 0

    for (const qId of questionIds) {
      const ans = answerMap[qId]
      if (!ans) continue

      totalTime += ans.time_taken_seconds ?? 0

      if (ans.is_correct) {
        correctCount++
        totalScore += questionMap[qId]?.is_special ? 2 : 1
      }
    }

    return { totalScore, correctCount, totalTime }
  }
}
