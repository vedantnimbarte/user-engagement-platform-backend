import { Router } from "express";
import { getPackages } from "../controllers/package.controller.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = Router();

router.get("/", checkToken, getPackages);

export default router;
