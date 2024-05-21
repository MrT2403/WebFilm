import express from "express";
import vnpayController from "../controllers/vnpay.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/", vnpayController.paymentWithVNpay);
router.post("/result", vnpayController.result);

export default router;
