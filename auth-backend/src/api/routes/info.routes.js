import { Router } from "express";
import {
  twoFactorInfo,
  userInfo,
  enableDisableTwoFactor,
  setupAuthenticator,
  verifyAuthenticator,
  getUserAllData,
} from "../controllers/info.controller.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = Router();

router.get("/user-info", checkToken, userInfo);
router.get("/two-factor-info", checkToken, twoFactorInfo);
router.post("/enable-disable-two-factor", checkToken, enableDisableTwoFactor);

router.post("/setup-authenticator", checkToken, setupAuthenticator);
router.post("/verify-authenticator", checkToken, verifyAuthenticator);

router.get("/user-data", checkToken, getUserAllData);

export default router;
