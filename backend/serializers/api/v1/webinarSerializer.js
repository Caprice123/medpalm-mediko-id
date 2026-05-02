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
      myRegistrationStatus: webinar.myRegistrationStatus ?? null,
      startAt: webinar.start_at,
      endAt: webinar.end_at,
      registrationStartAt: webinar.registration_start_at,
      registrationEndAt: webinar.registration_end_at,
      status: webinar.status,
      createdAt: webinar.created_at,
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
