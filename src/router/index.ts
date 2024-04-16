import { FastifyInstance } from "fastify";
import AnalyseRouter from "../modules/analyse/routes";
import AuthenticationRouter from "../modules/authentication/routes";
import { PaymentRouter, NoAuthPaymentRouter } from "../modules/payment/routes";
import UserRouter from "../modules/user/routes";
import TestWorker from "../modules/analyse/test-worker";
import AuthMiddlewareHandler from "../middlewares/ensureAuthenticated";
import LandingRouter from "../modules/landing/routes";
import { NotesRouter } from "../modules/notes/routes";

export function PublicAppRouter(
  fastify: FastifyInstance,
  opts: any,
  next: any
) {
  fastify.register(AuthenticationRouter, { prefix: "/app" });
  fastify.register(NoAuthPaymentRouter, { prefix: "/app" });
  fastify.register(LandingRouter, { prefix: "/landing" });

  next();
}

export function PrivateAppRouter(
  fastify: FastifyInstance,
  opts: any,
  next: any
) {
  fastify.addHook("preHandler", AuthMiddlewareHandler);
  fastify.register(UserRouter, { prefix: "/user" });
  fastify.register(AnalyseRouter, { prefix: "/ia" });
  fastify.register(NotesRouter, { prefix: "/notes" });
  fastify.register(PaymentRouter, { prefix: "/pay" });

  next();
}
