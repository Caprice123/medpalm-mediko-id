// Serializer for user-facing OSCE session
class OsceSessionSerializer {
  static serialize(session) {
    return {
      id: session.id,
      uniqueId: session.unique_id,
      userId: session.user_id,
      topicId: session.osce_topic_id,
      topicTitle: session.osce_topic?.title,
      topicDescription: session.osce_topic?.description,
      topicScenario: session.osce_topic?.scenario,
      topicGuide: session.osce_topic?.guide,
      topicContext: session.osce_topic?.context,
      topicAnswerKey: session.osce_topic?.answer_key,
      topicKnowledgeBase: session.osce_topic?.knowledge_base || [],
      topicAttachments: session.osce_topic?.attachments || [],
      topicDurationMinutes: session.osce_topic?.duration_minutes,
      systemPrompt: session.osce_topic?.system_prompt, // Include for starting session
      aiModelUsed: session.ai_model_used,
      durationMinutes: session.duration_minutes,
      totalScore: session.total_score,
      maxScore: session.max_score,
      aiFeedback: session.ai_feedback,
      creditsUsed: session.credits_used,
      observationsCount: session.osce_session_observations?.length || 0,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
    };
  }

  static serializeList(sessions) {
    return sessions.map(session => this.serialize(session));
  }

  // Lighter serialization for session list (without system prompt)
  static serializeListItem(session) {
    return {
      id: session.id,
      uniqueId: session.unique_id,
      topicId: session.osce_topic_id,
      topicTitle: session.osce_topic?.title,
      topicDescription: session.osce_topic?.description,
      aiModelUsed: session.ai_model_used,
      durationMinutes: session.duration_minutes,
      totalScore: session.total_score,
      maxScore: session.max_score,
      aiFeedback: session.ai_feedback,
      creditsUsed: session.credits_used,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
    };
  }

  static serializeListItems(sessions) {
    return sessions.map(session => this.serializeListItem(session));
  }
}

export default OsceSessionSerializer;
