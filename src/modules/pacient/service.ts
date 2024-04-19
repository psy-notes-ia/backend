import prisma from "../../prisma";

export default class PacientService {
  async create(name: string, id:string) {
    return await prisma.pacients.create({
      data: {
        name: name,
        userId: id
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
      include: { _count: { select: { Notes: true } } },
    });
  }
}
