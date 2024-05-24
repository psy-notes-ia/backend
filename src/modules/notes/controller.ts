import { FastifyReply, FastifyRequest } from "fastify";
import FormService from "./service";
import crypto from "crypto";
import { EncryptData } from "../../utils/crypto";
import Security from "../../utils/security";

const security = new Security();
const service = new FormService();

export default class FormController {
  async createNote(request: FastifyRequest, reply: FastifyReply) {
    const data: any = request.body;
    data.summary = security.encrypt(
      (data.note as string).substring(0, 100) + "..."
    );
    data.note = security.encrypt(data.note);

    const res = await service.create(data);

    return reply.status(201).send(res.id);
  }

  async getNotes(request: FastifyRequest, reply: FastifyReply) {
    const { pacientId }: any = request.params;

    if (!pacientId) {
      reply.status(403).send("bus id not provided");
    }
    const response = await service.getAllByPacient(pacientId);
    return reply.status(200).send(response);
  }

  async getAllNotes(request: FastifyRequest, reply: FastifyReply) {
    const { id }: any = request.user;

    const response = await service.getAll(id);
    return reply.status(200).send(response);
  }

  async deleteNote(request: FastifyRequest, reply: FastifyReply) {
    const { noteId }: any = request.params;

    if (!noteId) {
      reply.status(403).send(" id not provided");
    }
    const response = await service.delete(noteId);
    return reply.status(200).send(response);
  }

  async getByQuery(request: FastifyRequest, reply: FastifyReply) {
    const { q }: any = request.params;

    const res = await service.searchByQuery(q);

    return reply.status(200).send(res);
  }

  async getNotesById(request: FastifyRequest, reply: FastifyReply) {
    const { noteId }: any = request.params;

    if (!noteId) {
      reply.status(403).send("pacient id not provided");
    }

    const response = await service.getById(noteId);
    return reply.status(200).send(response);
  }

  async getNotesSession(request: FastifyRequest, reply: FastifyReply) {
    const { pacientId }: any = request.params;

    if (!pacientId) {
      reply.status(403).send("pacient id not provided");
    }

    const response = await service.getAllNoteSessions(pacientId);
    return reply.status(200).send(response);
  }

  async updateNote(request: FastifyRequest, reply: FastifyReply) {
    const { noteId }: any = request.params;
    const { note }: any = request.body;

    console.log(note);
    if (!noteId) throw new Error("id not provided");

    const res = await service.updateNote(noteId,security.encrypt(note)!);

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
