import { Router } from "express";
import {
  preRegister,
  verifyRegistrationLink,
  registrationData,
  login,
  forgotPassword,
  resetPassword,
  sendMagicLink,
  verifyMagicLink,
  refreshToken,
  googleAuth,
} from "../controllers/auth.controller.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = Router();

router.post("/pre-register", preRegister);
router.post("/verify-registration-link", verifyRegistrationLink);
router.post("/registration-data", checkToken, registrationData);

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/magic-link", sendMagicLink);
router.post("/verify-magic-link", verifyMagicLink);
router.post("/refresh-token", refreshToken);
router.post("/google", googleAuth);

export default router;
