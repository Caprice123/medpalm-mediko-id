import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "../baseService.js"

export class CreateCreditPlanService extends BaseService {
    static async call(req) {
        const { name, description, credits, price, isActive, isPopular, discount, order } = req.body

        this.validate({ name, credits, price, discount })

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

    static validate({ name, credits, price, discount }) {
        if (!name || !credits || !price) {
            throw new ValidationError('Nama, jumlah kredit, dan harga wajib diisi')
        }

        if (credits <= 0) {
            throw new ValidationError('Jumlah kredit harus lebih dari 0')
        }

        if (price <= 0) {
            throw new ValidationError('Harga harus lebih dari 0')
        }

        if (discount && (discount < 0 || discount > 100)) {
            throw new ValidationError('Diskon harus antara 0 dan 100')
        }
    }
}