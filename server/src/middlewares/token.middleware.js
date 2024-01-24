import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";
import userModel from "../models/user.model.js";

const tokenDecode = (req) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];

      return jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
    }

    return false;
  } catch {
    return false;
  }
};

const auth = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {
      return responseHandler.unauthorize(res);
    }

    const token = bearerHeader.split(" ")[1];
    const tokenDecoded = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);

    const user = await userModel.findById(tokenDecoded.data);

    if (!user) {
      return responseHandler.unauthorize(res);
    }

    req.user = user;
    next();
  } catch (error) {
    return responseHandler.unauthorize(res);
  }
};

export default { auth, tokenDecode };
