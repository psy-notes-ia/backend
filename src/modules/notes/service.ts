import prisma from "../../prisma";

export default class NotesService {
  async create({ note, pacientId, session, summary, tags, limit, title }: any) {
    return await prisma.notes.create({
      data: {
        note: note,
        pacientId: pacientId,
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

  async getAll(id:string) {
    return await prisma.notes.findMany({
     where:{
      Pacient:{userId: id}
     },
      select: {
        id: true,
        title: true,
        note: true,
        tags: true,
        session: true,
        summary: true,
        Pacient:{select:{name:true}}
      },
      take: 6,
    });
  }
  async getAllByPacient(id: string) {
    return await prisma.notes.findMany({
      where: { pacientId: id },
      select: {
        id: true,
        title: true,
        note: true,
        tags: true,
        session: true,
        summary: true,
      },
      take: 6,
      orderBy: {
        createdAt: "desc",
      }
    });
  }

  async getById(id: string) {
    return await prisma.notes.findMany({
      where: { id },
    });
  }

  async getAllNoteSessions(id: string) {
    return await prisma.notes.findMany({
      where: { pacientId: id, AND: { analysed: { not: true } } },
      select: { session: true, id: true, title: true },
    });
  }
  async searchByQuery(q: string) {
    return await prisma.notes.findMany({
      where: { title: { contains: q } },
    });
  }

  async delete(id: string) {
    return await prisma.notes.delete({
      where: { id },
    });
  }
}
