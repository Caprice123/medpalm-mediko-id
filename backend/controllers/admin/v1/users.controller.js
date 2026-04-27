import { ValidationUtils } from "#utils/validationUtils";
import { GetListUsersService } from "#services/users/getListUsersService";
import { AddCreditService } from "#services/users/addCreditService";
import { GetUserSubscriptionsService } from "#services/users/getUserSubscriptionsService";
import { UpdateUserRoleService } from "#services/users/updateUserRoleService";
import { UpdateUserPermissionsService } from "#services/users/updateUserPermissionsService";
import { GetUserFeatureSubscriptionsService } from "#services/users/getUserFeatureSubscriptionsService";
import { UpdateUserFeatureSubscriptionsService } from "#services/users/updateUserFeatureSubscriptionsService";
import { UserSerializer } from "#serializers/admin/v1/userSerializer";
import { UserSubscriptionSerializer } from "#serializers/admin/v1/userSubscriptionSerializer";
import prisma from '#prisma/client';

class UsersController {
  async index(req, res) {
    ValidationUtils.validate_fields({
      request: req,
      requiredFields: [],
      optionalFields: ["email", "page", "perPage"],
    });
    const { users, isLastPage } = await GetListUsersService.call(req.query);

    res.status(200).json({
      data: UserSerializer.serialize(users),
      pagination: {
        page: req.query.page || 1,
        perPage: req.query.perPage || 50,
        isLastPage: isLastPage,
      },
    });
  }

  async show(req, res) {
    ValidationUtils.validate_fields({
      request: req,
      requiredFields: ["id"],
      optionalFields: [],
      source: "params"
    });

    const userId = parseInt(req.params.id);
    const { users } = await GetListUsersService.call({ userId });

    if (!users || users.length === 0) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.status(200).json({
      data: UserSerializer.serialize(users[0])
    });
  }

  async addCredit(req, res) {
    ValidationUtils.validate_fields({
      request: req,
      requiredFields: ["userId", "credit"],
      optionalFields: ["credit_type", "credit_expiry_days"],
    });
    const { userId, credit, credit_type, credit_expiry_days } = req.body
    await AddCreditService.call(parseInt(userId), credit, {
      creditType: credit_type || 'permanent',
      creditExpiryDays: credit_expiry_days ? parseInt(credit_expiry_days) : null
    });

    res.status(200).json({ data: { success: true } });
  }

  async getCreditBuckets(req, res) {
    const userId = parseInt(req.params.id)
    const now = new Date()

    const buckets = await prisma.user_credits.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    })

    const permanentBalance = buckets
      .filter(b => b.credit_type === 'permanent')
      .reduce((sum, b) => sum + parseFloat(b.balance), 0)

    const expiringBuckets = buckets
      .filter(b => b.credit_type === 'expiring')
      .map(b => {
        const isExpired = b.expires_at && new Date(b.expires_at) <= now
        const daysRemaining = b.expires_at
          ? Math.max(0, Math.ceil((new Date(b.expires_at) - now) / (1000 * 60 * 60 * 24)))
          : null
        return {
          id: b.id,
          balance: parseFloat(b.balance),
          expiresAt: b.expires_at,
          daysRemaining,
          isExpired,
          createdAt: b.created_at
        }
      })

    const totalBalance = permanentBalance + expiringBuckets
      .filter(b => !b.isExpired)
      .reduce((sum, b) => sum + b.balance, 0)

    res.status(200).json({
      data: { permanentBalance, expiringBuckets, totalBalance }
    })
  }

  async updateCreditBucket(req, res) {
    const userId = parseInt(req.params.id)
    const bucketId = parseInt(req.params.bucketId)
    const { balance, expires_at } = req.body

    const bucket = await prisma.user_credits.findFirst({
      where: { id: bucketId, user_id: userId }
    })
    if (!bucket) return res.status(404).json({ error: 'Credit bucket not found' })

    const updateData = { updated_at: new Date() }
    if (balance !== undefined) updateData.balance = parseFloat(parseFloat(balance).toFixed(2))
    if (expires_at !== undefined) updateData.expires_at = expires_at ? new Date(expires_at) : null

    await prisma.user_credits.update({ where: { id: bucketId }, data: updateData })

    res.status(200).json({ data: { success: true } })
  }

  async deleteCreditBucket(req, res) {
    const userId = parseInt(req.params.id)
    const bucketId = parseInt(req.params.bucketId)

    const bucket = await prisma.user_credits.findFirst({
      where: { id: bucketId, user_id: userId }
    })
    if (!bucket) return res.status(404).json({ error: 'Credit bucket not found' })

    await prisma.user_credits.delete({ where: { id: bucketId } })

    res.status(200).json({ data: { success: true } })
  }

  async getSubscriptions(req, res) {
    ValidationUtils.validate_fields({
      request: req,
      requiredFields: ["id"],
      optionalFields: ["page", "perPage", "status"],
      source: "params"
    });

    const userId = parseInt(req.params.id);
    const { page, perPage, status } = req.query;

    const { subscriptions, isLastPage } = await GetUserSubscriptionsService.call(userId, {
      page,
      perPage,
      status
    });

    res.status(200).json({
      data: UserSubscriptionSerializer.serialize(subscriptions),
      pagination: {
        page: parseInt(page) || 1,
        perPage: parseInt(perPage) || 20,
        isLastPage: isLastPage,
      },
    });
  }

  async updateRole(req, res) {
    ValidationUtils.validate_fields({
      request: req,
      requiredFields: ["id"],
      optionalFields: [],
      source: "params"
    });

    ValidationUtils.validate_fields({
      request: req,
      requiredFields: ["role"],
      optionalFields: [],
    });

    const userId = parseInt(req.params.id);
    const { role } = req.body;
    const requestingUserId = req.user.id;

    const updatedUser = await UpdateUserRoleService.call(userId, role, requestingUserId);

    res.status(200).json({
      data: UserSerializer.serialize(updatedUser),
      message: "User role updated successfully"
    });
  }

  async updatePermissions(req, res) {
    ValidationUtils.validate_fields({
      request: req,
      requiredFields: ["id"],
      optionalFields: [],
      source: "params"
    });

    ValidationUtils.validate_fields({
      request: req,
      requiredFields: ["permissions"],
      optionalFields: [],
    });

    const userId = parseInt(req.params.id);
    const { permissions } = req.body;
    const requestingUserId = req.user.id;

    const updatedUser = await UpdateUserPermissionsService.call(userId, permissions, requestingUserId);

    res.status(200).json({
      data: UserSerializer.serialize(updatedUser),
    });
  }

  async getFeatureSubscriptions(req, res) {
    const userId = parseInt(req.params.id)
    const subscriptions = await GetUserFeatureSubscriptionsService.call(userId)
    res.status(200).json({ data: subscriptions })
  }

  async updateFeatureSubscriptions(req, res) {
    const userId = parseInt(req.params.id)
    const { activeFeatures } = req.body

    if (!Array.isArray(activeFeatures)) {
      return res.status(400).json({ error: 'activeFeatures must be an array' })
    }

    const result = await UpdateUserFeatureSubscriptionsService.call(userId, activeFeatures)
    res.status(200).json({ data: result })
  }

}

export default new UsersController();
