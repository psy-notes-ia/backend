import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../prisma";

export default async function SaveEmails(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const {email}: any = JSON.parse(request.body as string);

  await prisma.emails.create({ data: { email: email } });
  return reply.status(200).send();
}
