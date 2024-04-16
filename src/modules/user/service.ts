import prisma from "../../prisma";

export default class UserService {
  async getSubscribeStatusByUID(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: { metadata: true, subscribeStatus: true },
    });
  }

  async createStartForm(id: string, data: string) {
    return await prisma.startForm.create({ data: { data: data, userId: id } });
  }
  async getInfoById(id: string) {
    return await prisma.user.findUnique({ where: { id } });
  }

  async updateFirstAcess(id: string) {
    return await prisma.user.update({
      where: { id },
      data: { firstAccess: false },
    });
  }
  async getFormsCountByInterval(userId: string, start: Date, end: Date) {
    return await prisma.form.count({
      where: {
        userId: userId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });
  }
}
