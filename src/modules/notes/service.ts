import prisma from "../../prisma";

export default class NotesService {
  async create({ note, patientId, session, summary, tags, limit, title }: any) {
    return await prisma.notes.create({
      data: {
        note: note,
        patientId: patientId,
        session: session,
        summary: summary,
        tags: tags,
        title: title,
      },
    });
  }

  async updateNote(id: string, note: string) {
    return await prisma.notes.update({
      where: { id },
      data: { note },
    });
  }

  async getAll(id: string) {
    return await prisma.notes.findMany({
      where: { patientId: id },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async getById(id: string, freePlan: boolean) {
    return await prisma.notes.findUnique({
      where: { id: id },
    });
  }

}
