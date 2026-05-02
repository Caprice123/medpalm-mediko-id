export class BannerSerializer {
  static serialize(banner) {
    return {
      id: banner.id,
      uniqueId: banner.unique_id,
      title: banner.title,
      description: banner.description,
      redirectUrl: banner.redirect_url,
      redirectLabel: banner.redirect_label,
      gradientStart: banner.gradient_start,
      gradientEnd: banner.gradient_end,
      isActive: banner.is_active,
      order: banner.order,
      createdAt: banner.created_at,
      updatedAt: banner.updated_at,
      image: banner.image
        ? { url: banner.image.url, filename: banner.image.blob?.filename }
        : null,
    }
  }

  static serializeList(banners) {
    return banners.map(b => this.serialize(b))
  }
}
