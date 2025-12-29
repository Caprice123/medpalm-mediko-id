import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "../baseService.js"

export class ToggleCreditPlanService extends BaseService {
    static async call(id, req) {
        const { isActive, isPopular } = req.body

        // Validate input
        await this.validate({ id, isActive, isPopular })

        // Prepare update data
        const updateData = {}
        if (isActive !== undefined) updateData.is_active = isActive
        if (isPopular !== undefined) updateData.is_popular = isPopular

        const plan = await prisma.credit_plans.update({
            where: { id: parseInt(id) },
            data: updateData
        })
        return plan
    }

    static async validate({ id, isActive, isPopular }) {
        // Check if plan exists
        const existingPlan = await prisma.credit_plans.findUnique({
            where: { id: parseInt(id) }
        })

        if (!existingPlan) {
            throw new ValidationError("Credit plan not found")
        }
    }
}