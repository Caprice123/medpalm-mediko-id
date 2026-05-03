export class EventRegistrationSerializer {
  static serialize(registration) {
    return {
      id: registration.id,
      uniqueId: registration.unique_id,
      eventId: registration.event_id,
      userId: registration.user_id,
      status: registration.status,
      adminNotes: registration.admin_notes,
      reviewedBy: registration.reviewed_by,
      reviewedAt: registration.reviewed_at,
      creditsGranted: registration.credits_granted,
      featuresGranted: registration.features_granted || [],
      createdAt: registration.created_at,
      updatedAt: registration.updated_at,
      user: registration.user
        ? { id: registration.user.id, name: registration.user.name, email: registration.user.email }
        : null,
      event: registration.event
        ? { id: registration.event.id, code: registration.event.code, title: registration.event.title, startAt: registration.event.start_at }
        : null,
      evidences: (registration.evidences || []).map(e => ({
        id: e.id,
        name: e.name,
        url: e.url,
        filename: e.blob?.filename,
        contentType: e.blob?.content_type,
      })),
    }
  }

  static serializeList(registrations) {
    return registrations.map(r => this.serialize(r))
  }
}
