export class UserLearningSessionSerializer {
    static serialize(user_learning_sessions) {
        return user_learning_sessions.map(sessions => ({
            id: sessions.id,
            title: sessions.title,
            type: sessions.type,
            creditUsed: sessions.credit_used,
            createdAt: sessions.created_at,
        }))
    }
}