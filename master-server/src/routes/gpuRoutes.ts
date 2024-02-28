import express from "express";
import * as gpuController from "../controllers/gpuController";

const router = express.Router();

router.post("/register", gpuController.register);

router.route("/").get(gpuController.getAllGpus);

router.post("/startup", gpuController.startUp);
router.post("/shutdown", gpuController.shutDown);
router.put("/heartbeat", gpuController.heartBeat);

router.route("/:id").get(gpuController.getGpu).patch(gpuController.updateGpu);

export default router;
