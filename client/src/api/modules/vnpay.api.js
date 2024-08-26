import privateClient from "../client/private.client";

const vnpayEndpoints = {
  payUrl: "vnpay/payment",
  returnUrl: "vnpay/payment/result",
};

const vnpayApi = {
  accessPay: async ({ orderId, amount }) => {
    try {
      const response = await privateClient.post(vnpayEndpoints.payUrl, {
        orderId,
        amount,
      });
      return { response };
    } catch (err) {
      return { err };
    }
  },
  returnUrl: async () => {
    try {
      const response = await privateClient.get(vnpayEndpoints.returnUrl);
      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default vnpayApi;
