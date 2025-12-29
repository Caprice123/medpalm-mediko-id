import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "../baseService.js"

export class CreateCreditPlanService extends BaseService {
    static async call(req) {
        const { name, description, credits, price, isActive, isPopular, discount, order } = req.body

        this.validate({ name, credits, price })

        const plan = await prisma.credit_plans.create({
            data: {
                name,
                description: description || null,
                credits: parseInt(credits),
                price: parseFloat(price),
                is_active: isActive !== undefined ? isActive : true,
                is_popular: isPopular !== undefined ? isPopular : false,
                discount: discount ? parseInt(discount) : 0,
                order: order ? parseInt(order) : 0
            }
        })
        return plan
    }

    static validate({ name, credits, price }) {
        if (!name || !credits || !price) {
            throw new ValidationError('Name, credits, and price are required')
        }

        if (credits <= 0) {
            throw new ValidationError('Credits must be greater than 0')
        }

        if (price <= 0) {
            throw new ValidationError('Price must be greater than 0')
        }

        if (discount && (discount < 0 || discount > 100)) {
            throw new ValidationError('Discount must be between 0 and 100')
        }
    }
}