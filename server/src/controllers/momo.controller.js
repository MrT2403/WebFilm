import axios from "axios";
import crypto from "crypto";
import Reservation from "../models/reservation.model.js";
import Payment from "../models/payment.model.js";
import userModel from "../models/user.model.js";

const execPostRequest = async (url, data) => {
  try {
    const response = await axios.post(url, data, {
      headers: { "Content-Type": "application/json" },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const paymentWithMomo = async (req, res) => {
  const endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
  const { MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, MOMO_SECRET_KEY, APP_URL } =
    process.env;

  const { orderId, amount } = req.body;
  const orderInfo = "Thanh toán qua MoMo";
  const ipnUrl = "http://localhost:3000/";
  const redirectUrl = `${APP_URL}/payment/result`;
  const extraData = "tests";
  const requestId = Date.now().toString();
  const requestType = "captureWallet";

  const rawHash = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  const signature = crypto
    .createHmac("sha256", MOMO_SECRET_KEY)
    .update(rawHash)
    .digest("hex");

  const data = {
    partnerCode: MOMO_PARTNER_CODE,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: "vi",
    extraData: extraData,
    requestType: requestType,
    signature: signature,
  };

  try {
    const result = await execPostRequest(endpoint, JSON.stringify(data));
    if (result.resultCode === 41) {
      return res
        .status(400)
        .json({ status: false, message: "Momo Order Id exist!" });
    }
    if (result.payUrl) {
      return res.status(200).json({
        status: true,
        message: "Momo success!",
        url: result.payUrl,
      });
    }
    return res
      .status(400)
      .json({ status: false, message: "Momo Order exist!" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error", error });
  }
};

const result = async (req, res) => {
  const { resultCode, orderId, amount } = req.body;
  const status = resultCode === "0" ? "Payment Success" : "Payment Not Success";

  try {
    const reservation = await Reservation.findById(orderId);
    if (reservation) {
      await reservation.update({ status });
      const newPayment = new Payment({
        amount,
        methods: "Momo",
        reservation_id: orderId,
      });
      await newPayment.save();

      const user = await userModel.findById(reservation.user_id);
      if (user) {
        const dataResult = await getInforReservation(orderId);

        return res.status(200).json({
          RspCode: "00",
          Message: "Confirm Success",
          OrderID: orderId,
        });
      }
    } else {
      return res
        .status(404)
        .json({ RspCode: "01", Message: "Order not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ RspCode: "99", Message: "Internal Server Error", error });
  }
};

export default { paymentWithMomo, result };
