import { Router } from "express";
import {
  getDomains,
  createDomain,
  updateDomain,
  deleteDomain,
} from "../controllers/domain.controller.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = Router();

router.get("/", checkToken, getDomains);
router.post("/", checkToken, createDomain);
router.put("/:id", checkToken, updateDomain);
router.delete("/:id", checkToken, deleteDomain);

export default router;
