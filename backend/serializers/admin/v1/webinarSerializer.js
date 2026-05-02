export class WebinarSerializer {
  static serialize(webinar) {
    return {
      id: webinar.id,
      uniqueId: webinar.unique_id,
      title: webinar.title,
      description: webinar.description,
      speakers: webinar.speakers || [],
      benefits: webinar.benefits,
      suitableFor: webinar.suitable_for || [],
      joinUrl: webinar.join_url || [],
      startAt: webinar.start_at,
      endAt: webinar.end_at,
      registrationStartAt: webinar.registration_start_at,
      registrationEndAt: webinar.registration_end_at,
      status: webinar.status,
      createdBy: webinar.created_by,
      createdAt: webinar.created_at,
      updatedAt: webinar.updated_at,
      registrationCount: webinar._count?.webinar_registrations ?? undefined,
      thumbnail: webinar.thumbnail
        ? {
            url: webinar.thumbnail.url,
            filename: webinar.thumbnail.blob?.filename,
          }
        : null,
    }
  }

  static serializeList(webinars) {
    return webinars.map(w => this.serialize(w))
  }
}
