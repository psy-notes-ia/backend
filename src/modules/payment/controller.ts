import { FastifyReply, FastifyRequest } from "fastify";
import { StripeHandler } from "../../integrations/stripe";
import PaymentService from "./service";

const gateway = new StripeHandler();

export default class PaymentController {
  async createCheckout(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<string | null> {
    const { metadata, price_id, recurring }: any = request.body;

    const {email}: any = request.user;

    const url = await gateway.generateCheckoutLink({
      email,
      metadata,
      price_id,
      recurring,
    });

    if (!url) throw new Error("Not capable to generate checkout link");

    return reply.send({url});
  }

  async createCustomerPortal(request: FastifyRequest, reply: FastifyReply) {
    const { id }: any = request.user;

    const res = await new PaymentService().getStripeCustomerId(id);

    if (!res) throw new Error("Customer id not found: 404");

    const url = await gateway.generateCustomerPortalLink({
      stripeCustomerId: res.stripeCustomerId!,
    });

    if (!url) throw new Error("Not capable to generate checkout link");

    return reply.status(201).send({url})
  }

  async fetchPlans(request: FastifyRequest, reply: FastifyReply) {
    return await gateway.fetchSubscriptionPlans();
  }

  async checkoutProcessed(request: FastifyRequest, reply: FastifyReply) {
    const { session_id }: any = request.params;

    if (!session_id) throw Error("session not provide");

    const session = await gateway.retrieveCheckoutBySeessionId({
      sessionId: session_id,
    });

    if (session.status == "complete") {
      const email = session.customer_email;

      const data = await new PaymentService().updateCustomerPaymentInfo(
        session.customer,
        "trialing",
        session.subscription,
        session.metadata,
        email ?? ""
      );
      // return NextResponse.redirect(
      //   new url("signup?up=true", process.env.NEXT_PUBLIC_url_BASE!)
      // );

      return reply.send({ data, valid: true });
    }
    return reply.status(400).send({ valid: false });
  }

  async freeAccountProccess(request: FastifyRequest, reply: FastifyReply) {
    const { name, email }: any = request.body;

    const sub = await gateway.createFreeSubscription(
      name,
      email,
    );
    
    const data = await new PaymentService().updateCustomerPaymentInfo(
      sub.customer,
      "active",
      sub.id,
      sub.metadata,
      email ?? ""
    );

    return reply.send({ data, valid: true });
  }
}
