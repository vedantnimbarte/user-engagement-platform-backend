import { Router } from "express";
import {
  getTeamUsers,
  createTeamUser,
  deleteTeamUser,
  reinviteTeamUser,
  assignRoleToUser,
  getUserData,
  setPassword,
  acceptInvitation,
} from "../controllers/team.controller.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = Router();

router.get("/users", checkToken, getTeamUsers);
router.post("/invite", checkToken, createTeamUser);
router.delete("/delete", checkToken, deleteTeamUser);
router.post("/reinvite", checkToken, reinviteTeamUser);
router.post("/assign-role", checkToken, assignRoleToUser);
router.get("/user-data", getUserData);
router.post("/set-password",checkToken, setPassword);
router.post("/accept-invitation",checkToken,acceptInvitation);

export default router;
