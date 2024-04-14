import responseHandler from "../handlers/response.handler.js";
import notificationModel from "../models/notification.model.js";
import Notification from "../models/notification.model.js";

const create = async (req, res) => {
  try {
    const review = new notificationModel({
      user: req.user.id,
      movieId,
      ...req.body,
    });
    await review.save();

    const notification = new Notification({
      user: req.user.id,
      review: review._id,
      action: "create",
    });
    await notification.save();

    responseHandler.created(res, {
      ...review._doc,
      id: review.id,
      user: req.user,
    });
  } catch {
    responseHandler.error(res);
  }
};

const get = async (req, res) => {
  try {
    const { notificationID } = req.params;
    const notification = await notificationModel.findOne({
      _id: notificationID,
      user: req.user.id,
    });
    if (!notification) return responseHandler.notfound(res);
  } catch (error) {
    responseHandler.error(res);
  }
};

const remove = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await reviewModel.findOne({
      _id: reviewId,
      user: req.user.id,
    });

    if (!review) {
      return responseHandler.notfound(res);
    }
    await review.deleteDocument();

    const notification = new Notification({
      user: req.user.id,
      review: reviewId,
      action: "delete",
    });
    await notification.save();

    responseHandler.ok(res);
  } catch (err) {
    responseHandler.error(res);
  }
};

export default { get, remove, create };
