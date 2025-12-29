import { ValidationError } from '#errors/validationError';
import prisma from '#prisma/client';
import { BaseService } from "../baseService.js";

export class updateCreditPlanService extends BaseService {
    static async call(id, req) {
        const { name, description, credits, price, isActive, isPopular, discount, order } = req.body

        // Validate input
        await this.validate({ id, name, description, credits, price, discount })

        // Prepare update data
        const updateData = {}
        if (name !== undefined) updateData.name = name
        if (description !== undefined) updateData.description = description
        if (credits !== undefined) updateData.credits = parseInt(credits)
        if (price !== undefined) updateData.price = parseFloat(price)
        if (isActive !== undefined) updateData.is_active = isActive
        if (isPopular !== undefined) updateData.is_popular = isPopular
        if (discount !== undefined) updateData.discount = parseInt(discount)
        if (order !== undefined) updateData.order = parseInt(order)

        const plan = await prisma.credit_plans.update({
            where: { id: parseInt(id) },
            data: updateData
        })
        return plan
    }

    static async validate({ id, name, description, credits, price, discount }) {
        // Check if plan exists
        const existingPlan = await prisma.credit_plans.findUnique({
            where: { id: parseInt(id) }
        })

        if (!existingPlan) {
            throw new ValidationError("Credit plan not found")
        }

        // Validation
        if (credits !== undefined && credits <= 0) {
            throw new ValidationError('Credits must be greater than 0')
        }

        if (price !== undefined && price <= 0) {
            throw new ValidationError('Price must be greater than 0')
        }

        if (discount !== undefined && (discount < 0 || discount > 100)) {
            throw new ValidationError('Discount must be between 0 and 100')
        }
    }
}