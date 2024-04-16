import { FastifyReply, FastifyRequest } from "fastify";
import UserService from "./service";
import { StripeHandler } from "../../integrations/stripe";

const gateway = new StripeHandler();
const service = new UserService();
export default class UserController {
  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id }: any = request.user;

    const user = await service.getSubscribeStatusByUID(id);

    return reply.send({ user });
  }
  async availableSub(request: FastifyRequest, reply: FastifyReply) {
    const { id }: any = request.user;
    let user = await service.getInfoById(id);
    let available = false;
    const currentTimestamp = new Date().getTime();

    try {
      const { monthLimit }: any = user?.metadata;

      const data = await gateway.retrieveSubscriptionPeriod(
        user?.stripeSubscriptionId!
      );

      const total = await service.getFormsCountByInterval(
        id,
        new Date(data.start),
        new Date(currentTimestamp)
      );

      const totalAvailable = monthLimit * data.recurring!;

      if (total < totalAvailable) {
        available = true;
      }
    } catch (error) {
      console.log(error);
    }
    return reply.send({ available });
  }

  async addStartFormAnswear(request: FastifyRequest, reply: FastifyReply) {
    const { id }: any = request.user;
    const data = (await request.body) as string;

    await service.createStartForm(id, data);

    await service.updateFirstAcess(id);

    return reply.status(200).send();
  }
}
