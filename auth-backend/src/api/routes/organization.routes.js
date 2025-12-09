import { Router } from "express";
import {
  getOrganizationProfile,
  updateOrganizationProfile,
} from "../controllers/organization.controller.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = Router();

router.get("/profile", checkToken, getOrganizationProfile);
router.put("/profile", checkToken, updateOrganizationProfile);

export default router;
