import PaymentController from "./controller";
import WebhookController from "./webhook";

const handler = new PaymentController();
const handlerWebhook = new WebhookController();

function PaymentRouter(router: any, opts: any, done: any) {
  router.post("/checkout", handler.createCheckout);
  router.get("/checkout/:session_id", handler.checkoutProcessed);
  router.post("/start-account", handler.freeAccountProccess);
  router.get("/portal/", handler.createCustomerPortal);
  done();
}

function NoAuthPaymentRouter(router: any, opts: any, done: any) {
  router.get("/plans", handler.fetchPlans);
  router.post("/webhook", handlerWebhook.execute);
  done();
}

export  {PaymentRouter, NoAuthPaymentRouter};
