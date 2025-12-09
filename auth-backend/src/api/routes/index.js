import { Router } from "express";
import authRoutes from "./auth.routes.js";
import infoRoutes from "./info.routes.js";
import organizationRoutes from "./organization.routes.js";
import domainRoutes from "./domain.routes.js";
import teamRoutes from "./team.routes.js";
import packageRoutes from "./package.routes.js";
import subscriptionRoutes from "./subscription.routes.js";
import roleRoutes from "./role.routes.js";
import webhookRoutes from "./webhook.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/info", infoRoutes);
router.use("/organization", organizationRoutes);
router.use("/domains", domainRoutes);
router.use("/teams", teamRoutes);
router.use("/packages", packageRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/roles", roleRoutes);
router.use("/webhook", webhookRoutes);

export default router;
