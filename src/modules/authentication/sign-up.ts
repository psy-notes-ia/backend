import { FastifyReply, FastifyRequest } from "fastify";

import AuthenticationService from "./service";
import { StripeHandler } from "../../integrations/stripe";
const service = new AuthenticationService();
const gateway = new StripeHandler();

export default async function CreateAccountHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { name, email, password, provider, country }: any = await request.body;

  if (!email) {
    return reply
      .status(403)
      .send({ message: "you miss email", type: "missing_email" });
  }

  try {
    const sub = await gateway.createFreeSubscription(name, email);
    const user = { name, email, password };

    const res = await service.createUser({
      user,
      provider,
      country,
      sub,
    });

    return reply.status(201).send(res);
  } catch (error) {
    console.log(error);
    return reply.status(500).send({ error });
  }
}
