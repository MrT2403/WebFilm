import privateClient from "../client/private.client";
import publicClient from "../client/public.client";

const userEndpoints = {
  signin: "user/signin",
  signup: "user/signup",
  getInfo: "user/info",
  passwordUpdate: "user/update-password",
  forgotPassword: "user/forgot-password",
  resetPassword: "user/reset-password",
};

const userApi = {
  signin: async ({ username, password }) => {
    try {
      const response = await publicClient.post(userEndpoints.signin, {
        username,
        password,
      });
      return { response };
    } catch (err) {
      return { err };
    }
  },
  signup: async ({ username, email, password, confirmPassword }) => {
    try {
      const response = await publicClient.post(userEndpoints.signup, {
        username,
        email,
        password,
        confirmPassword,
      });
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getInfo: async () => {
    try {
      const response = await privateClient.get(userEndpoints.getInfo);
      return { response };
    } catch (err) {
      return { err };
    }
  },
  passwordUpdate: async ({ password, newPassword, confirmNewPassword }) => {
    try {
      const response = await privateClient.put(userEndpoints.passwordUpdate, {
        password,
        newPassword,
        confirmNewPassword,
      });
      return { response };
    } catch (err) {
      return { err };
    }
  },
  forgotPassword: async ({ email }) => {
    try {
      const response = await publicClient.post(userEndpoints.forgotPassword, {
        email,
      });
      console.log("response fp: ", response);
      return { response };
    } catch (err) {
      console.log("errr: ", err);
      return { err };
    }
  },
  resetPassword: async ({ token, password, confirmPassword }) => {
    try {
      const response = await publicClient.post(userEndpoints.resetPassword, {
        token,
        password,
        confirmPassword,
      });
      return { response };
    } catch (err) {
      return { err };
    }
  },
};

export default userApi;
