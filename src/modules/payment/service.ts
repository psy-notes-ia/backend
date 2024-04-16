import prisma from "../../prisma";

export default class PaymentService {
  async getStripeCustomerId(uid: string) {
    return await prisma.user.findUnique({
      where: { id: uid },
      select: { stripeCustomerId: true },
    });
  }

  async updateCustomerPaymentInfo(
    customer: any,
    subStatus: string,
    subId: any,
    metadata: any,
    email: string
  ) {
    return await prisma.user.update({
      where: { email: email },
      data: {
        subscribeStatus: subStatus,
        stripeCustomerId: customer,
        stripeSubscriptionId: subId,
        metadata: metadata,
      },
      select: { metadata: true, subscribeStatus: true },
    });
  }
}
