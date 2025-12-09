import { Router } from "express";
import {
  createSubscription,
  changeSubscriptionStatusController,
  listInvoicesController,
  getSubscriptionDetailsController,
  listPaymentMethodsController,
  deletePaymentMethodController,
  getUpcomingInvoiceAmountController,
} from "../controllers/subscription.controller.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = Router();

router.post("/create-checkout-session", checkToken, createSubscription);
router.post("/status", checkToken, changeSubscriptionStatusController);
router.get("/invoices", checkToken, listInvoicesController);
router.get(
  "/details",
  checkToken,
  getSubscriptionDetailsController
);
router.get(
  "/payment-methods",
  checkToken,
  listPaymentMethodsController
);
router.delete(
  "/payment-methods/:payment_method_id",
  checkToken,
  deletePaymentMethodController
);
router.post(
  "/upcoming-invoice",
  checkToken,
  getUpcomingInvoiceAmountController
);

export default router;
