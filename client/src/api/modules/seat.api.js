import publicClient from "../client/public.client";

const seatEndpoints = {
  seatStatus: "seats/status",
};

const seatApi = {
  seatStatus: async () => {
    try {
      const response = await publicClient.get(seatEndpoints.seatStatus);
      console.log("seat response: ", response);
      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default seatApi;
