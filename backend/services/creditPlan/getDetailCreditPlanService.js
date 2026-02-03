import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client';
import { BaseService } from "../baseService.js";

export class GetDetailCreditPlanService extends BaseService {
    static async call(id) {
        const plan = await prisma.credit_plans.findUnique({
            where: { id: Number(id) }
        })
        if (!plan) {
            throw new ValidationError('Credit plan not found')
        }
        return plan
    }
}