import prisma from "../../prisma";
import { hash } from "bcryptjs";

export default class AuthenticationService {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
        email: true,
        name: true,
        subscribeStatus: true,
        // user: true,
        metadata: true,
        firstAccess: true
      },
    });
  }

  async getTokenById(id: string) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        tempToken: true,
      },
    });
  }
  async updateTempToken(email: string, token: string) {
    return await prisma.user.update({
      where: { email },
      data: { tempToken: token },
    });
  }

  async updatePassword(newPassword: string, uid: string) {
    return await prisma.user.update({
      where: { id: uid! },
      data: { password: await hash(newPassword, 10), tempToken: null }, //apaga o tempToken
    });
  }

  async createUserAndBusiness({ user, business, provider, country, sub }:any) {
    
    
    const exists = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    
    if (exists) {
      throw new Error("User exists: 409");
    }

    return await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        provider: provider,
        stripeCustomerId: sub.customer,
        stripeSubscriptionId: sub.id,
        metadata: sub.metadata,
        subscribeStatus: "active",
        password: await hash(user.password, 10),
        country: country,
        // Business: {
        //   create: {
        //     name: business.name,
        //     clients: business.clients,
        //     category: business.category,
        //     description: business.description,
        //   },
        // },
      },select:{email:true}
    });
  }
  async createUser({ user, provider, country, sub }:any) {
  
    const exists = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    
    if (exists) {
      throw new Error("User exists: 409");
    }

    return await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        provider: provider,
        stripeCustomerId: sub.customer,
        stripeSubscriptionId: sub.id,
        metadata: sub.metadata,
        subscribeStatus: "active",
        password: await hash(user.password, 10),
        country: country,
        
      },select:{id:true}
    });
  }
}
