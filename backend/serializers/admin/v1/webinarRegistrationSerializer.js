export class WebinarRegistrationSerializer {
  static serialize(registration) {
    return {
      id: registration.id,
      uniqueId: registration.unique_id,
      webinarId: registration.webinar_id,
      userId: registration.user_id,
      status: registration.status,
      adminNotes: registration.admin_notes,
      reviewedBy: registration.reviewed_by,
      reviewedAt: registration.reviewed_at,
      createdAt: registration.created_at,
      updatedAt: registration.updated_at,
      user: registration.user
        ? {
            id: registration.user.id,
            name: registration.user.name,
            email: registration.user.email,
          }
        : null,
      webinar: registration.webinar
        ? {
            id: registration.webinar.id,
            uniqueId: registration.webinar.unique_id,
            title: registration.webinar.title,
            startAt: registration.webinar.start_at,
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
