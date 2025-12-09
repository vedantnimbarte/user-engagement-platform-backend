import { Router } from "express";
import surveyRoutes from "./surveyRoutes.js";

const router = Router();

router.use("/", surveyRoutes);

export default router;
