import crypto from "crypto";
import QRCode from "qrcode";
import Reservation from "../models/reservation.model.js";
import Payment from "../models/payment.model.js";

const paymentWithVNpay = async (req, res) => {
  const { VNP_TMN_CODE, VNP_HASH_SECRET, APP_URL } = process.env;
  const { orderId, amount } = req.body;
  const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const vnpReturnUrl = `${APP_URL}/payment/result`;
  const startTime = new Date()
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
    vnp_OrderInfo: "Bill Payment",
    vnp_OrderType: "billpayment",
    vnp_ReturnUrl: vnpReturnUrl,
    vnp_TxnRef: orderId,
  };

  const sortedInput = Object.fromEntries(Object.entries(inputData).sort());
  const queryString = new URLSearchParams(sortedInput).toString();
  const secureHash = crypto
    .createHmac("sha512", VNP_HASH_SECRET)
    .update(queryString)
    .digest("hex");
  const paymentUrl = `${vnpUrl}?${queryString}&vnp_SecureHash=${secureHash}`;

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(paymentUrl);
    return res.status(200).json({
      code: "00",
      message: "success",
      data: {
        paymentUrl,
        qrCodeDataUrl,
      },
    });
  } catch (err) {
    console.error("Error generating QR code:", err);
    return res.status(500).json({
      code: "99",
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const result = async (req, res) => {
  const {
    vnp_SecureHash,
    vnp_TxnRef,
    vnp_Amount,
    vnp_ResponseCode,
    vnp_TransactionStatus,
    ...vnp_Params
  } = req.query;
  const { VNP_HASH_SECRET } = process.env;

  const sortedInput = Object.fromEntries(Object.entries(vnp_Params).sort());
  const queryString = new URLSearchParams(sortedInput).toString();
  const secureHashCheck = crypto
    .createHmac("sha512", VNP_HASH_SECRET)
    .update(queryString)
    .digest("hex");

  if (vnp_SecureHash === secureHashCheck) {
    try {
      const order = await Reservation.findById(vnp_TxnRef);
      if (order) {
        if (order.amount === vnp_Amount / 100) {
          const status =
            vnp_ResponseCode === "00" && vnp_TransactionStatus === "00"
              ? "Payment success"
              : "Payment not success";
          await order.update({ status });
          const newPayment = new Payment({
            amount: vnp_Amount / 100,
            methods: "VNPay",
            reservation_id: vnp_TxnRef,
          });
          await newPayment.save();

          if (status === "Payment success") {
            await blockSeats(order);
          }

          return res.redirect(`/payment/result`);
        }
        return res
          .status(400)
          .json({ RspCode: "04", Message: "Invalid Amount" });
      }
      return res
        .status(404)
        .json({ RspCode: "01", Message: "Order not found" });
    } catch (error) {
      console.error("Error processing payment result:", error);
      return res
        .status(500)
        .json({ RspCode: "99", Message: "Internal Server Error", error });
    }
  } else {
    return res
      .status(400)
      .json({ RspCode: "97", Message: "Invalid signature" });
  }
};

const blockSeats = async (order) => {
  try {
    const { seats, showtimeId, cinemaId, date } = order;

    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      throw new Error("Showtime not found");
    }

    seats.forEach((seatNumber) => {
      const seat = showtime.seats.find((s) => s.number === seatNumber);
      if (seat) {
        seat.isBlocked = true;
      }
    });

    await showtime.save();
  } catch (error) {
    console.error("Error blocking seats:", error);
  }
};

export default { paymentWithVNpay, result };
