import prisma from "../../prisma";
import { FastifyRequest, FastifyReply } from "fastify";

export default async function CheckAnalyseStatus(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { itemId, status }: any = request.params;
 

  if (!itemId) {
    return reply.status(403).send("Id not found");
  }
  const item = await prisma.analyse.findUnique({
    where: { id: itemId },
    select: { analysed: true },
  });

  const new_status = item?.analysed != status;

  return reply.send({ new_status });
}
