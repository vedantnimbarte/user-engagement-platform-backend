import { handleWebhook } from "../services/webhook.service.js";

const stripeWebhook = async (req, res) => {
  return await handleWebhook(req, res);
};

export { stripeWebhook };
