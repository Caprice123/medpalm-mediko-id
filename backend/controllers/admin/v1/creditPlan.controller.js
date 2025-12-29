import { GetDetailCreditPlanService } from '#services/creditPlan/getDetailCreditPlanService'
import { CreditPlanDetailSerializer } from '#serializers/admin/v1/creditPlanDetailSerializer'
import { CreditPlanSerializer } from '#serializers/admin/v1/creditPlanSerializer'
import { GetListCreditsService } from '#services/creditPlan/getListCreditsService'
import { CreateCreditPlanService } from '#services/creditPlan/createCreditPlanService'
import { updateCreditPlanService } from '#services/creditPlan/updateCreditplanService'
import { ToggleCreditPlanService } from '#services/creditPlan/toggleCreditPlanService'

class CreditPlanController {
    async index(req, res) {
        const plans = await GetListCreditsService.call(req)

        res.status(200).json({
            data: CreditPlanSerializer.serialize(plans)
        })
    }

    async show(req, res) {
        const { id } = req.params
        const plan = await GetDetailCreditPlanService.call(id)

        res.status(200).json({
            data: CreditPlanDetailSerializer.serialize(plan)
        })
    }

    async create(req, res) {
        const plan = await CreateCreditPlanService.call(req)

        res.status(201).json({
            data: CreditPlanDetailSerializer.serialize(plan)
        })
    }

    async update(req, res) {
        const { id } = req.params
        const plan = await updateCreditPlanService.call(id, req)

        res.status(200).json({
            data: CreditPlanDetailSerializer.serialize(plan)
        })
    }
    
    async toggle(req, res) {
        const { id } = req.params
        const plan = await ToggleCreditPlanService.call(id, req)

        res.status(200).json({
            data: CreditPlanDetailSerializer.serialize(plan)
        })
    }
}

export default new CreditPlanController();
