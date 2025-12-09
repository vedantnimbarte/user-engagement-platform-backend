import { Router } from "express";
import { organizationScriptIdChecker } from "../middlewares/organizationScriptIdChecker.js";
import { deactiveController, identifyController, manageController, trackController, trackerController, trackMeController } from "../controllers/tracking.controller.js";
const router = Router();

router.use(organizationScriptIdChecker);
router.post("/cs", trackMeController);
router.post("/track", trackController);
router.post("/da", deactiveController);
router.post("/manage", manageController);
router.post("/identify",identifyController);
router.post("/t",trackerController);

export default router;
