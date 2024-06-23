import jwt from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";
import userModel from "../models/user.model.js";

const tokenDecode = (req) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];
      if (!token) {
        console.error("Token not found in authorization header.");
        return false;
      }
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } else {
      console.error("Authorization header not found.");
      return false;
    }
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return false;
  }
};

const auth = async (req, res, next) => {
  try {
    const tokenDecoded = tokenDecode(req);
    if (!tokenDecoded) {
      console.error("Token decoding failed or token is invalid.");
      return responseHandler.unauthorize(res);
    }

    const user = await userModel.findById(tokenDecoded.data);
    if (!user) {
      console.error("User not found for token data:", tokenDecoded.data);
      return responseHandler.unauthorize(res);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authorization error:", error.message);
    return responseHandler.unauthorize(res);
  }
};

export default { auth, tokenDecode };
