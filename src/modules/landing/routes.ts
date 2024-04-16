import { FastifyInstance } from "fastify";
import SaveEmails from "./save-emails";
import rateLimit from "@fastify/rate-limit";
// import rateLimit from "express-rate-limit";

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 10, // limit each IP to 100 requests per windowMs
//   message: "Too many requests from this IP, please try again later.",
// });

export default function LandingRouter(
  router: FastifyInstance,
  opts: any,
  done: any
) {
  router.register(rateLimit, {
    max: 5,
    timeWindow: "15 minute",
  });
  router.post("/emails", SaveEmails);
  done();
}
