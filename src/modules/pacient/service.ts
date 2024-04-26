import prisma from "../../prisma";

export default class PacientService {
  async create(data: any, id: string) {
    return await prisma.pacients.create({
      data: {
        ...data,
        userId: id,
      },
    });
  }

  async delete(id: string) {
    return await prisma.pacients.delete({
      where: { id },
    });
  }

  async fetchAll(id: string) {
    return await prisma.pacients.findMany({
      where: { userId: id },
      select: { id: true, name: true, _count: { select: { Notes: true } } },
    });
  }

  async searchByQuery(q: string) {
    return await prisma.pacients.findMany({
      where: { name: { contains: q } },
      select: { id: true, name: true, _count: { select: { Notes: true } } },
    });
  }
}
