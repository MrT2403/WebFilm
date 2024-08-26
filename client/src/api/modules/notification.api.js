import privateClient from "../client/private.client";

const notificationEndpoints = {
  list: "user/notifications",
  remove: ({ notificationID }) => `user/notifications/${notificationID}`,
};

const notificationApi = {
  getList: async () => {
    try {
      const response = await privateClient.get(notificationEndpoints.list);

      return { response };
    } catch (error) {
      return { error };
    }
  },
  remove: async ({ notificationID }) => {
    try {
      const response = await privateClient.delete(
        notificationEndpoints.remove({ notificationID })
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default notificationApi;
