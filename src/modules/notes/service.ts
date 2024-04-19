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
        note: true,
        tags: true,
        session: true,
        summary: true,

      },
      take:6
    });
  }

  async getById(id: string) {
    return await prisma.notes.findMany({
      where: { id },
    });
  }
  async delete(id: string) {
    return await prisma.notes.delete({
      where: { id },
    });
  }

}
