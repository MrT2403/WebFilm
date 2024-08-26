import crypto from "crypto";
import nodemailer from "nodemailer";
import userModel from "../models/user.model.js";
import PasswordResetToken from "../models/passwordResetToken.model.js";
import responseHandler from "../handlers/response.handler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const checkUser = await userModel.findOne({ username });

    if (checkUser) {
      return responseHandler.badrequest(res, "Username already used");
    }

    const user = new userModel({ email, username });
    user.setPassword(password);
    await user.save();

    const token = jwt.sign({ data: user.id }, process.env.TOKEN_SECRET, {
      expiresIn: "24h",
    });

    const { password: _, salt: __, ...userData } = user.toObject();
    responseHandler.created(res, { token, ...userData, id: user.id });
  } catch (error) {
    responseHandler.error(res);
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel
      .findOne({ username })
      .select("username email password salt id");

    if (!user) {
      return responseHandler.badrequest(res, "User does not exist");
    }

    if (!user.validPassword(password)) {
      return responseHandler.badrequest(res, "Wrong password");
    }

    const token = jwt.sign({ data: user.id }, process.env.TOKEN_SECRET, {
      expiresIn: "24h",
    });

    const { password: _, salt: __, ...userData } = user.toObject();
    responseHandler.ok(res, { token, ...userData, id: user.id });
  } catch (error) {
    responseHandler.error(res);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return responseHandler.notfound(res, "Email not found");
    }

    const token = crypto.randomBytes(20).toString("hex");

    const resetToken = new PasswordResetToken({
      userId: user._id,
      token,
    });

    await resetToken.save();

    const resetUrl = `http://localhost:3000/user/reset-password/${token}`;
    // https://web-film-eosin.vercel.app

    const mailOptions = {
      from: `no-reply@nottris.com`,
      to: user.email,
      subject: "Password Reset Request",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account on NotTris website.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             ${resetUrl}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.SMTP_EMAIL,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: process.env.OATH_ACCESS_TOKEN,
      },
    });

    console.log("Transporter created successfully:", transporter);

    await transporter.sendMail(mailOptions);

    responseHandler.ok(res, "Password reset email sent");
  } catch (error) {
    console.error("Error in forgotPassword:", error.message, error);
    responseHandler.error(
      res,
      "Failed to send password reset email. Please try again later."
    );
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return responseHandler.badrequest(res, "Passwords do not match");
    }

    const resetToken = await PasswordResetToken.findOne({ token });
    if (!resetToken) {
      return responseHandler.badrequest(res, "Invalid or expired token");
    }

    const user = await userModel.findById(resetToken.userId);
    if (!user) {
      return responseHandler.notfound(res, "User not found");
    }

    user.setPassword(password);
    await user.save();
    await PasswordResetToken.deleteOne({ token });

    responseHandler.ok(res, "Password reset successfully");
  } catch (error) {
    console.log("userController: ", error);
    responseHandler.error(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const user = await userModel
      .findById(req.user.id)
      .select("password id salt");

    if (!user) {
      return responseHandler.unauthorize(res);
    }

    if (!user.validPassword(password)) {
      return responseHandler.badrequest(res, "Wrong password");
    }

    user.setPassword(newPassword);
    await user.save();
    responseHandler.ok(res);
  } catch (error) {
    responseHandler.error(res);
  }
};

const getInfo = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("-password -salt");
    if (!user) {
      return responseHandler.notfound(res);
    }
    responseHandler.ok(res, user);
  } catch (error) {
    responseHandler.error(res);
  }
};

export default {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  getInfo,
  updatePassword,
};
