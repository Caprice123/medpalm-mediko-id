import { ValidationError } from '#errors/validationError';
import prisma from '#prisma/client';
import { BaseService } from "../baseService.js";
import { addUserCredits, deductUserCredits } from '#utils/creditUtils';

export class AddCreditService extends BaseService {
    static async call(userId, credit, { creditType = 'permanent', creditExpiryDays = null } = {}) {
        // Validate user exists
        const user = await prisma.users.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new ValidationError("User not found");
        }

        // Validate credit amount
        const creditAmount = parseFloat(credit);
        if (isNaN(creditAmount) || creditAmount === 0) {
            throw new ValidationError("Credit must be a non-zero number");
        }

        await prisma.$transaction(async (tx) => {
            if (creditAmount > 0) {
                let expiresAt = null
                if (creditType === 'expiring' && creditExpiryDays) {
                    expiresAt = new Date()
                    expiresAt.setDate(expiresAt.getDate() + creditExpiryDays)
                }

                await addUserCredits(tx, userId, creditAmount, {
                    creditType,
                    expiresAt,
                    description: `Admin added ${creditAmount} credits`,
                    transactionType: 'admin_bonus',
                    paymentMethod: 'manual_admin'
                });
            } else {
                await deductUserCredits(tx, userId, Math.abs(creditAmount), `Admin deducted ${Math.abs(creditAmount)} credits`);
            }
        });
    }
}