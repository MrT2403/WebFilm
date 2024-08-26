import express from "express";
import cinemaController from "../controllers/cinema.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/", cinemaController.getCinemas);
router.post("/", cinemaController.createCinema);
router.get("/:id", cinemaController.getCinemaById);
router.put("/:id", cinemaController.updateCinema);
router.delete("/:id", cinemaController.deleteCinema);

export default router;
