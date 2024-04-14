import express from "express";
import theatreController from "../controllers/theatre.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/nearby", theatreController.getNearbyTheatres);
router.post("/", theatreController.addTheatre);

export default router;
