import crypto from "crypto";
import https from "https";

// Thay thế các giá trị này bằng thông tin MoMo cung cấp cho bạn
const partnerCode = "MOMO";
const accessKey = "F8BBA842ECF85";
const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

const requestId = `${partnerCode}${new Date().getTime()}`;
const orderId = requestId;
const orderInfo = "pay with MoMo";
const redirectUrl = "https://momo.vn/return";
const ipnUrl = "https://callback.url/notify";
const amount = "50000";
const requestType = "captureWallet";
const extraData = ""; // Pass empty value if your merchant does not have stores

// Format raw signature before signing with HMAC SHA256
const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

// Generate signature using HMAC SHA256
const signature = crypto
  .createHmac("sha256", secretKey)
  .update(rawSignature)
  .digest("hex");

// JSON object to send to MoMo endpoint
const requestBody = JSON.stringify({
  partnerCode: partnerCode,
  accessKey: accessKey,
  requestId: requestId,
  amount: amount,
  orderId: orderId,
  orderInfo: orderInfo,
  redirectUrl: redirectUrl,
  ipnUrl: ipnUrl,
  extraData: extraData,
  requestType: requestType,
  signature: signature,
  lang: "en",
});

// HTTPS request options
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

// Send the request and get the response
const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  res.setEncoding("utf8");
  res.on("data", (body) => {
    console.log("Body: ");
    console.log(body);
    console.log("payUrl: ");
    console.log(JSON.parse(body).payUrl);
  });
  res.on("end", () => {
    console.log("No more data in response.");
  });
});

req.on("error", (e) => {
  console.log(`Problem with request: ${e.message}`);
});

// Write data to request body
console.log("Sending request...");
req.write(requestBody);
req.end();
