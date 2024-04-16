
import Fastify, { FastifyInstance } from "fastify";
import {
  CheckTokenFromResetPassword,
  ResetPassword,
  SendResetPasswordEmail,
} from "./forgot-password";

import AuthenticationHandler from "./sign-in";
// import SignOutHandler from "./sign-out";
import CreateAccountHandler from "./sign-up";
import TestAuthenticationHandler from "./status";

function AuthenticationRouter(fastify: FastifyInstance, opts: any, done: any) {
  fastify.post("/signin", AuthenticationHandler);
  fastify.post("/signup", CreateAccountHandler);
  // fastify.get("/signout", SignOutHandler);
  fastify.get("/session", TestAuthenticationHandler);

  fastify.patch("/reset-pass/:uid", ResetPassword);
  fastify.post("/forgot/:email", SendResetPasswordEmail);
  fastify.get("/forgot", CheckTokenFromResetPassword);

  done();
}
export default AuthenticationRouter;
