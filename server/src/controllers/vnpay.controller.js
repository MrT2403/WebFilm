import crypto from "crypto";
import Reservation from "../models/reservation.model.js";
import Payment from "../models/payment.model.js";

const paymentWithVNpay = (req, res) => {
  const { VNP_TMN_CODE, VNP_HASH_SECRET, APP_URL } = process.env;
  const { orderId, amount } = req.body;
  const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const vnpReturnUrl = `${APP_URL}/payment/result`;
  const startTime = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);
  const expire = new Date(Date.now() + 10 * 60 * 1000)
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);

  const inputData = {
    vnp_Version: "2.1.0",
    vnp_TmnCode: VNP_TMN_CODE,
    vnp_Amount: amount * 100,
    vnp_Command: "pay",
    vnp_CreateDate: startTime,
    vnp_CurrCode: "VND",
    vnp_IpAddr: req.ip,
    vnp_Locale: "vn",
    vnp_OrderInfo: "Thanh toan hoa don",
    vnp_OrderType: "billpayment",
    vnp_ReturnUrl: vnpReturnUrl,
    vnp_TxnRef: orderId,
    vnp_ExpireDate: expire,
  };

  const sortedInput = Object.fromEntries(Object.entries(inputData).sort());
  const queryString = new URLSearchParams(sortedInput).toString();
  const secureHash = crypto
    .createHmac("sha512", VNP_HASH_SECRET)
    .update(queryString)
    .digest("hex");
  const paymentUrl = `${vnpUrl}?${queryString}&vnp_SecureHash=${secureHash}`;

  return res
    .status(200)
    .json({ code: "00", message: "success", data: paymentUrl });
};

const result = async (req, res) => {
  const {
    vnp_SecureHash,
    vnp_TxnRef,
    vnp_Amount,
    vnp_ResponseCode,
    vnp_TransactionStatus,
  } = req.body;
  const { VNP_HASH_SECRET } = process.env;

  const inputData = {};
  req.body.values.forEach(({ key, value }) => {
    inputData[key] = value;
  });

  const secureHash = crypto
    .createHmac("sha512", VNP_HASH_SECRET)
    .update(new URLSearchParams(inputData).toString())
    .digest("hex");

  if (secureHash === vnp_SecureHash) {
    try {
      const order = await Reservation.findById(vnp_TxnRef);
      if (order) {
        if (order.amount == vnp_Amount / 100) {
          const status =
            vnp_ResponseCode === "00" && vnp_TransactionStatus === "00"
              ? "Thanh toán"
              : "Không thành công";
          await order.update({ status });
          const newPayment = new Payment({
            amount: vnp_Amount / 100,
            methods: "VNPay",
            reservation_id: vnp_TxnRef,
          });
          await newPayment.save();

          return res
            .status(200)
            .json({ RspCode: "00", Message: "Confirm Success" });
        }
        return res
          .status(400)
          .json({ RspCode: "04", Message: "Invalid Amount" });
      }
      return res
        .status(404)
        .json({ RspCode: "01", Message: "Order not found" });
    } catch (error) {
      return res
        .status(500)
        .json({ RspCode: "99", Message: "Internal Server Error", error });
    }
  }
  return res.status(400).json({ RspCode: "97", Message: "Invalid signature" });
};

export default { paymentWithVNpay, result };
