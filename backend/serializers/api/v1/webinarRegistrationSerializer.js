export class WebinarRegistrationSerializer {
  static serialize(registration) {
    return {
      id: registration.id,
      uniqueId: registration.unique_id,
      status: registration.status,
      adminNotes: registration.admin_notes,
      reviewedAt: registration.reviewed_at,
      createdAt: registration.created_at,
      webinar: registration.webinar
        ? {
            id: registration.webinar.id,
            uniqueId: registration.webinar.unique_id,
            title: registration.webinar.title,
            startAt: registration.webinar.start_at,
            endAt: registration.webinar.end_at,
            joinUrl: registration.webinar.join_url || [],
          }
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
