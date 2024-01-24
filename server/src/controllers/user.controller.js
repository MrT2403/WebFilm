import userModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";

const signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const checkUser = await userModel.findOne({ username });
    if (checkUser)
      return responseHandler.badrequest(res, "Username already used");
    const user = new userModel();
    user.email = email;
    user.username = username;
    user.setPassword(password);
    console.log("not save");
    await user.save();
    console.log("save");
    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    user.password = undefined;
    user.salt = undefined;

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
    });
  } catch {
    responseHandler.error(res);
  }
};

// const signin = async (req, res) => {
//   try {
//     console.log("hiiiii: ", req);
//     const { username, password } = req.body;
//     const user = await userModel
//       .findOne({ username })
//       .select("username email password salt id");
//     if (!user) return responseHandler.badrequest(res, "User does not exist");
//     if (!user.validPassword(password))
//       return responseHandler.badrequest(res, "Wrong password");
//     responseHandler.ok(res);
//   } catch {
//     responseHandler.error(res);
//   }
// };

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

    user.password = undefined;
    user.salt = undefined;

    responseHandler.ok(res, {
      token,
      ...user._doc,
      id: user.id,
    });
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const user = await userModel
      .findById(req.user.id)
      .select("password id salt");

    if (!user) return responseHandler.unauthorize(res);
    if (!user.validPassword(password))
      return responseHandler.badrequest(res, "Wrong password");

    user.setPassword(newPassword);

    await user.save();

    user.password = undefined;
    user.salt = undefined;

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getInfo = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("-password -salt");

    if (!user) return responseHandler.notfound(res);

    responseHandler.ok(res, user);
  } catch {
    responseHandler.error(res);
  }
};

export default {
  signup,
  signin,
  getInfo,
  updatePassword,
};
