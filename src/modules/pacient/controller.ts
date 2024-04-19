import { FastifyReply, FastifyRequest } from "fastify";
import PacientService from "./service";
import crypto from "crypto";

const service = new PacientService();

export default class PacientController {
  async createPacient(request: FastifyRequest, reply: FastifyReply) {
    const {name}:any = request.body;
    const {id}:any = request.user;

    console.log(id);
    const res = await service.create(name, id);

    return reply.status(201).send(res);
  }
  async getAllPacients(request: FastifyRequest, reply: FastifyReply) {
   const { id }: any = request.user;

    const res = await service.fetchAll(id);

    return reply.status(200).send(res);
  }

  async deletePacient(request: FastifyRequest, reply: FastifyReply) {
    const { id }: any = request.params;

    if (!id) {
      reply.status(403).send("bus id not provided");
    }
    const response = await service.delete(id)
    ;
    return reply.status(200).send(response);
  }
}

function generateReferenceCode(length: number = 10): string {
  return crypto
    .randomBytes(length)
    .toString("hex")
    .slice(0, length)
    .toUpperCase();
}
