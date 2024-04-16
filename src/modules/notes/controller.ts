import { FastifyReply, FastifyRequest } from "fastify";
import FormService from "./service";
import crypto from "crypto";

const service = new FormService();

export default class FormController {
  async createNote(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body;

    const res = await service.create(data);

    return reply.status(201).send(res);
  }

  async getNotes(request: FastifyRequest, reply: FastifyReply) {
    const { id }: any = request.user;

    if (!id) {
      reply.status(403).send("bus id not provided");
    }
    const response = await service.getAll(id);
    return reply.status(200).send(response);
  }

  async getNotesById(request: FastifyRequest, reply: FastifyReply) {
    const { formId }: any = request.params;
    if (!formId) {
      reply.status(403).send("form id not provided");
    }
    const { metadata }: any = request.user;

    const { name } = metadata;

    const response = await service.getById(
      formId,
      (name as string).toLowerCase() === "free"
    );
    return reply.status(200).send(response);
  }

  async updateNote(request: FastifyRequest, reply: FastifyReply) {
    const { id }: any = request.params;
    const { note }: any = request.body;

    if (!id) throw new Error("id not provided");

    const res = await service.updateNote(id, note);

    return reply.status(200).send(res);
  }
}

function generateReferenceCode(length: number = 10): string {
  return crypto
    .randomBytes(length)
    .toString("hex")
    .slice(0, length)
    .toUpperCase();
}
