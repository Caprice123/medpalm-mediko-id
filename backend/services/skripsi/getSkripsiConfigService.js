import { BaseService } from '#services/baseService'
import { GetConstantsService } from '#services/constant/getConstantsService'

export class GetSkripsiConfigService extends BaseService {
  static async call() {
    const constantKeys = [
      'skripsi_is_active',
      'skripsi_ai_researcher_enabled',
      'skripsi_validated_enabled',
      'skripsi_ai_researcher_cost',
      'skripsi_validated_cost',
      'skripsi_ai_researcher_user_information',
      'skripsi_validated_user_information'
    ]

    const constantsMap = await GetConstantsService.call(constantKeys)

    return {
      is_active: constantsMap.skripsi_is_active === 'true',
      availableModes: {
        research: constantsMap.skripsi_ai_researcher_enabled === 'true',
        validated: constantsMap.skripsi_validated_enabled === 'true'
      },
      costs: {
        research: parseFloat(constantsMap.skripsi_ai_researcher_cost || '0'),
        validated: parseFloat(constantsMap.skripsi_validated_cost || '0')
      },
      userInformation: {
        research: constantsMap.skripsi_ai_researcher_user_information || '',
        validated: constantsMap.skripsi_validated_user_information || ''
      }
    }
  }
}
