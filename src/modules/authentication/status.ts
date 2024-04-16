import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../../middlewares/ensureAuthenticated";

const app = fastify();

export default async function TestAuthenticationHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {

    console.log(request.cookies.session);
const session = request.cookies.session;
  if (!session) {
    return reply.status(403).send("you're not logged in");
  }

  const decoded =(await verifyToken(session));

  const subscribeStatus = decoded.data.subscribeStatus ?? null;
  return reply.status(200).send({subscribeStatus});

 
}
