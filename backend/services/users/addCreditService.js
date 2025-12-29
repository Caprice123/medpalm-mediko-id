import { ValidationError } from '#errors/validationError';
import prisma from '#prisma/client';
import { BaseService } from "../baseService.js";

export class AddCreditService extends BaseService {
    static async call(userId, credit) {
        const userCredit = await prisma.user_credits.findFirst({
            where: {
                user_id: userId,
            },
        })
        if (!userCredit) {
            throw new ValidationError('User credit not found')
        }
        const newBalance = userCredit.balance + credit
        await prisma.user_credits.update({
            where: {
                id: userCredit.id,
            },
            data: {
                balance: newBalance,
            },
        })
    }
}