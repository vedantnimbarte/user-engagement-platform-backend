import { Router } from "express";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getSubFeatures,
} from "../controllers/role.controller.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = Router();

router.get("/", checkToken, getRoles);
router.get("/details", checkToken, getSubFeatures);
router.post("/", checkToken, createRole);
router.put("/", checkToken, updateRole);
router.delete("/", checkToken, deleteRole);

export default router;
