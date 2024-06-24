import express from "express";
import userRoute from "./user.route.js";
import mediaRoute from "./media.route.js";
import personRoute from "./person.route.js";
import reviewRoute from "./review.route.js";
import cinemaRoute from "./cinema.route.js";
import vnpayRoute from "./vnpay.route.js";
import momoRoute from "./momo.route.js";
import seatRoute from "./seat.route.js";

const router = express.Router();

router.use("/user", userRoute);
router.use("/person", personRoute);
router.use("/reviews", reviewRoute);
router.use("/cinemas", cinemaRoute);
router.use("/vnpay", vnpayRoute);
router.use("/momo", momoRoute);
router.use("/:mediaType", mediaRoute);
router.use("/seats", seatRoute);

export default router;
