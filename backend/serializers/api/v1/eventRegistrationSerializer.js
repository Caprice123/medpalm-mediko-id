export class EventRegistrationSerializer {
  static serialize(registration) {
    return {
      id: registration.id,
      uniqueId: registration.unique_id,
      status: registration.status,
      adminNotes: registration.admin_notes,
      reviewedAt: registration.reviewed_at,
      creditsGranted: registration.credits_granted,
      featuresGranted: registration.features_granted || [],
      createdAt: registration.created_at,
      event: registration.event
        ? {
            id: registration.event.id,
            code: registration.event.code,
            title: registration.event.title,
            registrationStartAt: registration.event.registration_start_at,
            registrationEndAt: registration.event.registration_end_at,
          }
        : null,
      evidences: (registration.evidences || []).map(e => ({
        id: e.id,
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
