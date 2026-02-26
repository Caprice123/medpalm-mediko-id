import { ValidationUtils } from "#utils/validationUtils";
import { AddSubscriptionService } from "#services/users/addSubscriptionService";
import { UpdateSubscriptionService } from "#services/users/updateSubscriptionService";
import { DeleteSubscriptionService } from "#services/users/deleteSubscriptionService";

class SubscriptionsController {
  /**
   * Add a subscription for a user
   * PUT /admin/v1/subscriptions
   */
  async addSubscription(req, res) {
    ValidationUtils.validate_fields({
      request: req,
      requiredFields: ["userId", "startDate", "endDate"],
      optionalFields: [],
    });

    await AddSubscriptionService.call(
      req.body.userId,
      req.body.startDate,
      req.body.endDate
    );

    res.status(200).json({
      data: { success: true },
    });
  }

  /**
   * Update a subscription's dates (superadmin only)
   * PATCH /admin/v1/subscriptions/:id
   */
  async updateSubscription(req, res) {
    const subscriptionId = parseInt(req.params.id);

    ValidationUtils.validate_fields({
      request: req,
      requiredFields: ["startDate", "endDate"],
      optionalFields: [],
    });

    await UpdateSubscriptionService.call(
      subscriptionId,
      req.body.startDate,
      req.body.endDate
    );

    res.status(200).json({
      data: { success: true },
    });
  }

  /**
   * Delete a subscription (superadmin only)
   * DELETE /admin/v1/subscriptions/:id
   */
  async deleteSubscription(req, res) {
    const subscriptionId = parseInt(req.params.id);

    await DeleteSubscriptionService.call(subscriptionId);

    res.status(200).json({
      data: { success: true },
    });
  }
}

export default new SubscriptionsController();
