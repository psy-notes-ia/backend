import prisma from "../../prisma";

export default class UserService {
  async getSubscribeStatusByUID(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: { metadata: true, subscribeStatus: true },
    });
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

}
