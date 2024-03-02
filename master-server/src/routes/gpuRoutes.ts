import express from "express";
import * as gpuController from "../controllers/gpuController";
import * as authController from "../controllers/authController";

const router = express.Router();

router.post("/register", gpuController.register);

router.route("/").get(authController.protect, authController.restrictTo("supervisor", "admin"), gpuController.getAllGpus);

router.post("/startup", gpuController.startUp);
router.post("/shutdown", gpuController.shutDown);
router.put("/heartbeat", gpuController.heartBeat);

router.route("/:id").get(gpuController.getGpu).patch(gpuController.updateGpu);

export default router;
