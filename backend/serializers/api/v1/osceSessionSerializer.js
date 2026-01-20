import attachmentService from '#services/attachment/attachmentService'
import idriveService from '#services/idrive.service';
import { DateTime } from "luxon";

// Serializer for user-facing OSCE session
class OsceSessionSerializer {
  static async serialize(session) {
    // Use snapshot data if available, otherwise fall back to original topic
    const topicData = session.osce_session_topic_snapshot || session.osce_topic || {}

    // Fetch session attachments with presigned URLs
    let attachmentsWithUrls = []
    try {
      const sessionAttachments = await attachmentService.getAttachments('osce_session', session.id)
      attachmentsWithUrls = await Promise.all(
        sessionAttachments.map(async (attachment) => {
          const url = await attachmentService.getAttachmentWithUrl('osce_session', session.id, attachment.name)
          return {
            blobId: attachment.blob_id,
            filename: attachment.blob?.filename || attachment.name,
            url: url?.url || null,
            contentType: attachment.blob?.content_type || 'application/octet-stream'
          }
        })
      )
    } catch (error) {
      console.error('[OsceSessionSerializer] Error fetching attachments:', error)
    }

    // Serialize observation groups
    const observationGroups = session.osce_session_observation_group_snapshots?.map(groupSnapshot => ({
      groupName: groupSnapshot.group_name,
      observations: groupSnapshot.osce_session_observation_snapshots?.map(obsSnapshot => {
        return {
          snapshotId: obsSnapshot.id,
          name: obsSnapshot.observation_name,
        }
      }) || [],
    })) || []

    const savedObservations = session.osce_session_observations
    console.log(savedObservations)

    // Add attachments for each observation
    const observationsWithAttachments = await Promise.all(
      savedObservations.map(async (obs) => {
        const attachments = await attachmentService.getAttachments(
          'osce_session_observation_snapshot',
          obs.observation_snapshot_id
        )

        return {
          id: obs.id,
          snapshotId: obs.observation_snapshot_id,
          observationId: obs.observation_snapshot.observation_id,
          name: obs.observation_snapshot.observation_name,
          observationText: obs.observation_snapshot.observation_text,
          requiresInterpretation: obs.observation_snapshot.requires_interpretation,
          interpretation: obs.interpretation,
          attachments: attachments.length > 0 ? {
            id: attachments[0].id,
            name: attachments[0].name,
            url: attachments[0].blob?.key ? await idriveService.getSignedUrl(attachments[0].blob.key) : null,
            contentType: attachments[0].blob?.content_type || null,
          } : null,
        }
      })
    )

    // Serialize diagnoses
    const diagnoses = session.osce_session_diagnoses?.map(d => ({
      id: d.id,
      type: d.type,
      diagnosis: d.diagnosis,
      createdAt: d.created_at,
    })) || []

    // Serialize therapies
    const therapies = session.osce_session_therapies?.map(t => ({
      id: t.id,
      therapy: t.therapy,
      order: t.order,
      createdAt: t.created_at,
    })) || []

    const now = DateTime.now().setZone('Asia/Jakarta');
    const scheduledEnd = DateTime.fromJSDate(session.scheduled_end_at, { zone: 'utc' }).setZone('Asia/Jakarta');
    const remainingSeconds = Math.max(0, Math.floor(scheduledEnd.diff(now, 'seconds').seconds));

    return {
      id: session.id,
      uniqueId: session.unique_id,
      userId: session.user_id,
      status: session.status,
      observationsLocked: session.observations_locked,
      topic: {
          id: session.osce_topic_id,
          title: topicData.title,
          description: topicData.description,
          answerKey: session.status == "completed" ? topicData.answer_key : null,
          scenario: topicData.scenario,
          guide: topicData.guide,
          attachments: attachmentsWithUrls || [],
          remainingTime: remainingSeconds,
      },
      result: {
          totalScore: session.total_score,
          maxScore: session.max_score,
          aiFeedback: session.ai_feedback,
          actualDurationMinutes: session.actual_duration_minutes,
      },
      availableObservation: observationGroups,
      userAnswer: {
          observations: observationsWithAttachments,
          diagnoses: diagnoses,
          therapies: therapies,
      }
    };
  }

  static async serializeList(sessions) {
    return await Promise.all(sessions.map(session => this.serialize(session)));
  }

  // Lighter serialization for session list (without system prompt)
  static serializeListItem(session) {
    // Use snapshot data if available, otherwise fall back to original topic
    const topicData = session.osce_session_topic_snapshot || session.osce_topic || {}

    return {
      id: session.id,
      uniqueId: session.unique_id,
      status: this.formatStatus(session),
      topicTitle: topicData.title,
      topicDescription: topicData.description,
      timeTaken: topicData.time_taken,
      totalScore: session.total_score,
      maxScore: session.max_score,
      aiFeedback: JSON.parse(session.ai_feedback),
      createdAt: session.created_at,
      scheduledEnd: session.scheduled_end_at,
      tags: session.osce_session_tag_snapshots?.map((snapshot) => ({
        id: snapshot.tag_id,
        name: snapshot.tags.name,
        tagGroup: {
            name: snapshot.tags.tag_group.name
        }
      }))
    };
  }

  
    static formatStatus = (session) => {
        if (session.status != "started") {
            return session.status
        }

        const scheduledEndAt = DateTime.fromJSDate(session.scheduled_end_at, { zone: "utc" });
        const nowUtc = DateTime.utc();
        const isPassed = nowUtc > scheduledEndAt;

        if (isPassed) {
            return "expired"
        }
        return session.status
    }

  static serializeListItems(sessions) {
    return sessions.map(session => this.serializeListItem(session));
  }
}

export default OsceSessionSerializer;
