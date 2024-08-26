import express from "express";
import { body } from "express-validator";
import favoriteController from "../controllers/favorite.controller.js";
import userController from "../controllers/user.controller.js";
import requestHandler from "../handlers/request.handler.js";
import userModel from "../models/user.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import notificationController from "../controllers/notification.controller.js";
import { verifyRefreshToken, generateTokens } from "../utils/token.js";

const router = express.Router();

router.post(
  "/signup",
  body("username")
    .exists()
    .withMessage("username is required")
    .isLength({ min: 5 })
    .withMessage("username minimum 5 characters")
    .custom(async (value) => {
      const user = await userModel.findOne({ username: value });
      if (user) throw new Error("username already used");
    }),
  body("email")
    .exists()
    .withMessage("email is required")
    .isLength({ min: 8 })
    .withMessage("email minimum 8 characters")
    .isEmail()
    .withMessage("email is invalid"),
  requestHandler.validate,
  userController.signup,
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password minimum 8 characters"),
  body("confirmPassword")
    .exists()
    .withMessage("confirmPassword is required")
    .isLength({ min: 8 })
    .withMessage("confirmPassword minimum 8 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("confirmPassword not match");
      return true;
    })
);

router.post(
  "/signin",
  body("username")
    .exists()
    .withMessage("username is required")
    .isLength({ min: 5 })
    .withMessage("username minimum 5 characters"),
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password minimum 8 characters"),
  requestHandler.validate,
  userController.signin
);

router.put(
  "/update-password",
  tokenMiddleware.auth,
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password minimum 8 characters"),
  body("newPassword")
    .exists()
    .withMessage("newPassword is required")
    .isLength({ min: 8 })
    .withMessage("newPassword minimum 8 characters"),
  body("confirmNewPassword")
    .exists()
    .withMessage("confirmNewPassword is required")
    .isLength({ min: 8 })
    .withMessage("confirmNewPassword minimum 8 characters")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword)
        throw new Error("confirmNewPassword not match");
      return true;
    }),
  requestHandler.validate,
  userController.updatePassword
);

router.get("/info", tokenMiddleware.auth, userController.getInfo);

router.get(
  "/favorites",
  tokenMiddleware.auth,
  favoriteController.getFavoritesOfUser
);

router.get("/notifications", tokenMiddleware.auth, notificationController.get);

router.post(
  "/favorites",
  tokenMiddleware.auth,
  body("mediaType")
    .exists()
    .withMessage("mediaType is required")
    .custom((type) => ["movie", "tv"].includes(type))
    .withMessage("mediaType invalid"),
  body("mediaId")
    .exists()
    .withMessage("mediaId is required")
    .isLength({ min: 1 })
    .withMessage("mediaId can not be empty"),
  body("mediaTitle").exists().withMessage("mediaTitle is required"),
  body("mediaPoster").exists().withMessage("mediaPoster is required"),
  body("mediaRate").exists().withMessage("mediaRate is required"),
  requestHandler.validate,
  favoriteController.addFavorite
);

router.delete(
  "/favorites/:favoriteId",
  tokenMiddleware.auth,
  favoriteController.removeFavorite
);

router.post(
  "/forgot-password",
  body("email")
    .exists()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email is invalid"),
  requestHandler.validate,
  userController.forgotPassword
);

router.post(
  "/reset-password",
  body("token").exists().withMessage("Token is required"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("confirmPassword")
    .exists()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm Password does not match Password");
      }
      return true;
    }),
  requestHandler.validate,
  userController.resetPassword
);

router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const userId = await verifyRefreshToken(refreshToken);
    const tokens = await generateTokens(userId);

    res.json(tokens);
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
});

export default router;
