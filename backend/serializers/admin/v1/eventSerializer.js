export class EventSerializer {
  static serialize(event) {
    return {
      id: event.id,
      code: event.code,
      title: event.title,
      description: event.description,
      registrationStartAt: event.registration_start_at,
      registrationEndAt: event.registration_end_at,
      status: event.status,
      creditsOnApproval: event.credits_on_approval,
      creditType: event.credit_type,
      creditExpiryDays: event.credit_expiry_days,
      allowedFeatures: event.allowed_features || [], // [{ key, durationDays }]
      createdBy: event.created_by,
      createdAt: event.created_at,
      updatedAt: event.updated_at,
      registrationCount: event._count?.event_registrations ?? undefined,
      thumbnail: event.thumbnail
        ? { url: event.thumbnail.url, filename: event.thumbnail.blob?.filename }
        : null,
    }
  }

  static serializeList(events) {
    return events.map(e => this.serialize(e))
  }
}
