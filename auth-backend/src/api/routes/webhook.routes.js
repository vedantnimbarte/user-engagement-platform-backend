import { Router } from "express";
import express from "express";
import { stripeWebhook } from "../controllers/webhook.controller.js";

const router = Router();

// Use raw body for Stripe webhook
router.post(
  "/stripe-webhook",
  stripeWebhook
);

export default router;
