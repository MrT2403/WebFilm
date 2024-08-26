import express from "express";
import vnpayController from "../controllers/vnpay.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/payment", vnpayController.paymentWithVNpay);
router.get("/payment/result", vnpayController.result);

export default router;
