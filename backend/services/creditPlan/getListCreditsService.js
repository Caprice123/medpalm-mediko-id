import { BaseService } from "../baseService.js";
import prisma from '#prisma/client';

export class GetListCreditsService extends BaseService {
    static async call(req) {
        const where = {}


        const plans = await prisma.credit_plans.findMany({
            where: where,
            orderBy: [
                { order: 'asc' },
                { created_at: 'desc' }
            ]
        })
    }
}