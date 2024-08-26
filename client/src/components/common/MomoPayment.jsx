// Trong file momoPayment.js
// Import MoMoService và các dependencies khác
import MoMoService from "./momo";

// Khai báo component và nhận props
const MoMoPayment = ({ priceGlobal }) => {
  // Khai báo các thông tin cần thiết
  const partnerCode = "MOMO";
  const accessKey = "F8BBA842ECF85";
  const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const requestId = partnerCode + new Date().getTime() + "id";
  const orderId = new Date().getTime() + ":0123456778";
  const orderInfo = "Pay with Momo";
  const redirectUrl =
    "https://clever-tartufo-c324cd.netlify.app/pages/home.html";
  const ipnUrl = "https://clever-tartufo-c324cd.netlify.app/pages/home.html";
  const amount = priceGlobal; // Sử dụng giá trị priceGlobal ở đây
  const requestType = "captureWallet";
  const extraData = "";

  // Khởi tạo đối tượng MoMoService với các thông tin đã được khai báo
  const momoService = new MoMoService(partnerCode, accessKey, secretkey);

  // Tạo dữ liệu thanh toán và gọi phương thức createPayment từ MoMoService
  const data = {
    requestId: requestId,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    amount: amount,
    requestType: requestType,
    extraData: extraData,
  };

  momoService
    .createPayment(data)
    .then((response) => {
      console.log("Payment response:", response);
    })
    .catch((error) => {
      console.error("Error creating payment:", error);
    });

  // Return JSX component
  return <div>{/* Hiển thị giao diện của trang Payment */}</div>;
};

export default MoMoPayment;
