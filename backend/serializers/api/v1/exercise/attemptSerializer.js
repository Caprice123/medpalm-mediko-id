export class AttemptSerializer {
    static serialize(exerciseSessionAttempts) {
        return exerciseSessionAttempts.map(attempt => ({
            id: attempt.id,
            attemptNumber: attempt.attempt_number,
            status: attempt.status,
            score: attempt.score,
            totalQuestion: attempt.totalQuestion,
            createdAt: attempt.created_at,
        }))
    }
}