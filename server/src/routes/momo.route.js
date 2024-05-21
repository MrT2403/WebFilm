import express from "express";
import momoController from "../controllers/momo.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/", momoController.paymentWithMomo);
router.post("/result", momoController.result);

export default router;
