import crypto from "crypto";
import https from "https";

class MoMoService {
  constructor(partnerCode, accessKey, secretKey) {
    this.partnerCode = partnerCode;
    this.accessKey = accessKey;
    this.secretKey = secretKey;
  }

  createPayment(data) {
    return new Promise((resolve, reject) => {
      const requestId = this.partnerCode + new Date().getTime();
      const orderId = requestId;
      const rawSignature = `accessKey=${this.accessKey}&amount=${data.amount}&extraData=${data.extraData}&ipnUrl=${data.ipnUrl}&orderId=${orderId}&orderInfo=${data.orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${data.redirectUrl}&requestId=${requestId}&requestType=${data.requestType}`;

      const signature = crypto
        .createHmac("sha256", this.secretKey)
        .update(rawSignature)
        .digest("hex");

      const requestBody = JSON.stringify({
        partnerCode: this.partnerCode,
        accessKey: this.accessKey,
        requestId: requestId,
        amount: data.amount,
        orderId: orderId,
        orderInfo: data.orderInfo,
        redirectUrl: data.redirectUrl,
        ipnUrl: data.ipnUrl,
        extraData: data.extraData,
        requestType: data.requestType,
        signature: signature,
        lang: "en",
      });

      const options = {
        hostname: "test-payment.momo.vn",
        port: 443,
        path: "/v2/gateway/api/create",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(requestBody),
        },
      };

      const req = https.request(options, (res) => {
        let responseData = "";

        res.on("data", (chunk) => {
          responseData += chunk;
        });

        res.on("end", () => {
          resolve(JSON.parse(responseData));
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.write(requestBody);
      req.end();
    });
  }

  verifyPayment(responseData) {}
}

const partnerCode = process.env.MOMO_PARTNER_CODE;
const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;

const momoService = new MoMoService(partnerCode, accessKey, secretKey);

const data = {
  amount: "50000",
  extraData: "",
  ipnUrl: "https://callback.url/notify",
  redirectUrl: "https://momo.vn/return",
  orderInfo: "Pay with MoMo",
  requestType: "captureWallet",
};

momoService
  .createPayment(data)
  .then((response) => {})
  .catch((error) => {
    console.error("Error creating payment:", error);
  });

export default MoMoService;
