import prisma from "../../prisma";
import { FastifyRequest, FastifyReply } from "fastify";

export default async function FecthAllAnalyses(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { pacientId }: any = request.params;
 

  if (!pacientId) {
    return reply.status(403).send("Id not found");
  }
  
  const res = await prisma.analyse.findMany({
    where: { pacientId },
    take: 6
  });

  return reply.send(res);
}
