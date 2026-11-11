import { BaseService } from '#services/baseService'
import { GetSkripsiConfigService } from '#services/skripsi/getSkripsiConfigService'
import { GetSkripsiSetsV2Service } from '#services/skripsi/v2/getSkripsiSetsV2Service'
import { SkripsiSetListV2Serializer } from '#serializers/api/v2/skripsiSetListSerializer'
import { ValidationError } from '#errors/validationError'

// The set list page needs the feature config (which modes exist, what they
// cost, their per-mode notice) as well as the first page of sets. V1 asked for
// them separately on mount, which left the mode selector showing defaults until
// the second response landed. This answers both in one read.
export class GetSkripsiBootstrapV2Service extends BaseService {
  static async call({ userId, perPage = 20 }) {
    this.validate({ userId })

    const [config, sets] = await Promise.all([
      GetSkripsiConfigService.call(),
      GetSkripsiSetsV2Service.call({ userId, page: 1, perPage }),
    ])

    return {
      config,
      sets: SkripsiSetListV2Serializer.serialize(sets.data),
      pagination: sets.pagination,
    }
  }

  static validate({ userId }) {
    if (!userId || isNaN(parseInt(userId))) {
      throw new ValidationError('ID pengguna tidak valid')
    }
  }
}
