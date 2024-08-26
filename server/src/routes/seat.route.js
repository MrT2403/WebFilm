import express from "express";
import seatController from "../controllers/seat.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/blockSeats", seatController.blockSeats);
router.get("/getBlockedSeats", seatController.getBlockedSeats);
router.get("/status", seatController.seatStatus);
router.post("/post", seatController.seatBook);

export default router;
