import { FastifyReply, FastifyRequest } from "fastify";
import { StripeHandler } from "../../integrations/stripe";
import prisma from "../../prisma";

const gateway = new StripeHandler();

export default class WebhookController {
   
    async execute( request: FastifyRequest,
        reply: FastifyReply
      ): Promise<any> {

          const event: any = request.body;
          
          try {
            // const sig = request.headers.get("stripe-signature");
            // const event = gateway.createWebhookEvent({payload, signature});

            switch (event.type) {
                // case "customer.subscription.paused":
                //   const customerSubscriptionPaused = event.data.object;
                //   console.log("pause app account");
                //   console.log(customerSubscriptionPaused);
                //   // Then define and call a function to handle the event customer.subscription.paused
                //   break;
                case "customer.subscription.deleted" || "customer.subscription.paused":
                    const customerSubscriptionPaused = event.data.object;
                    const _customer_id = customerSubscriptionPaused.customer;
                    console.log(customerSubscriptionPaused);

                    const pis =
                        (
                            customerSubscriptionPaused.latest_invoice as {
                                payment_intent: { status: string };
                            }
                        ).payment_intent.status ?? "";

                    if (_customer_id)
                          await prisma.user.update({
                            where: { stripeCustomerId: _customer_id.toString() },
                            data: {
                              subscribeStatus: customerSubscriptionPaused.status,
                              paymentIntentStatus: pis,
                            },
                          });
                        // console.log(customerSubscriptionPaused);
                        break;

                case "customer.subscription.updated":
                    console.log("update subscription");
                    const customerSubscriptionUpdated = event.data.object;
                    const { customer, status } = customerSubscriptionUpdated;

                    const customer_id = customer.toString();

                    const plan = await gateway.retrieveAProduct(
                      (customerSubscriptionUpdated as any).plan.product
                    );

                    if (customer_id)
                          await prisma.user.update({
                            where: { stripeCustomerId: customer_id },
                            data: {
                              subscribeStatus: status,
                              metadata: plan.metadata,
                              // paymentIntentStatus: invoices.status,
                            },
                          });
                        break;

                default:
                    console.log(`Unhandled event type ${event.type}`);
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);

                throw new Error(err.message);
            }
        }
        return reply.send({ received: true });
    }
}