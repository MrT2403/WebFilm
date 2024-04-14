import express from "express";
import cinemaController from "../controllers/cinema.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/cinemas", cinemaController.getCinemas);

export default router;
