import { ValidationUtils } from "#utils/validationUtils";
import { GetListUsersService } from "#services/users/getListUsersService";
import { AddCreditService } from "#services/users/addCreditService";
import { GetUserSubscriptionsService } from "#services/users/getUserSubscriptionsService";
import { UpdateUserRoleService } from "#services/users/updateUserRoleService";
import { UserSerializer } from "#serializers/admin/v1/userSerializer";
import { UserSubscriptionSerializer } from "#serializers/admin/v1/userSubscriptionSerializer";

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
      optionalFields: [],
    });
    await AddCreditService.call(req.body.userId, req.body.credit);

    res.status(200).json({
      data: {
        success: true,
      },
    });
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

}

export default new UsersController();
