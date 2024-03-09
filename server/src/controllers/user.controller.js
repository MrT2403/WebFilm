import userModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";

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

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    const { password: _, salt: __, ...userData } = user.toObject();

    responseHandler.created(res, {
      token,
      ...userData,
      id: user.id,
    });
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

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    const { password: _, salt: __, ...userData } = user.toObject();

    responseHandler.ok(res, {
      token,
      ...userData,
      id: user.id,
    });
  } catch (error) {
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
  getInfo,
  updatePassword,
};
