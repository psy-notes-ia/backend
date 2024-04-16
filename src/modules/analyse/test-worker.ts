import { FastifyRequest, FastifyReply } from "fastify";
import sendToQueue from "../../messaging";

export default async function TestWorker(
  request: FastifyRequest,
  reply: FastifyReply
) {
  var sent = sendToQueue("testando");

  console.log(sent);
  if (sent) reply.status(200);
  else reply.status(400);
}
