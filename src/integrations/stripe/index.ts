import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SK!);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET!;
const FRONTEND_URL = process.env.STRIPE_ENDPOINT_SECRET!;

export class StripeHandler {
  async generateCheckoutLink({
    metadata,
    price_id,
    email,
    recurring,
  }: {
    metadata: any;
    price_id: string;
    email: string;
    recurring: number;
  }) {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: price_id,

          quantity: 1,
        },
      ],

      customer_email: email,
      mode: "subscription",
      metadata: metadata,
      discounts: [
        {
          coupon: recurring > 1 ? process.env.STRIPE_COUPON! : undefined,
        },
      ],
      allow_promotion_codes: recurring > 1 ? undefined : true,
      subscription_data: {
        metadata: metadata,
        // trial_period_days: 14,
        // trial_settings: {
        //   end_behavior: {
        //     missing_payment_method: "pause",
        //   },
        // },
      },
      success_url: `${process.env.FRONTEND_URL}/signup?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/signup`,
    });
    return session.url;
  }

  async retrieveSubscriptionPeriod(subId: string) {
    const sub = await stripe.subscriptions.retrieve(subId);
    return {
      start: sub.current_period_start,
      recurring: sub.items.data[0].price.recurring?.interval_count,
    };
    // current_period_start
  }

  async generateCustomerPortalLink({
    stripeCustomerId,
  }: {
    stripeCustomerId: string;
  }) {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/?up=true`,
    });

    return session.url;
  }

  async retrieveCheckoutBySeessionId({ sessionId }: { sessionId: string }) {
    return await stripe.checkout.sessions.retrieve(sessionId);
  }

  async fetchSubscriptionPlans() {
    const products = await stripe.products.list({
      limit: 3,
      active: true,
    });

    const prices = await stripe.prices.list({
      active: true,
      currency: "brl",
    });

    return { products: products.data, prices: prices.data };
  }

  createWebhookEvent({ payload, sig }: any) {
    return stripe.webhooks.constructEvent(payload, sig!, endpointSecret);
  }

  async retrieveAProduct(pid: any) {
    return await stripe.products.retrieve(pid);
  }

  async createFreeSubscription(
    name: string,
    email: string
  ): Promise<Stripe.Subscription> {
    const plans = await this.fetchSubscriptionPlans();
    const freePlan = plans.products.find(
      (e) => e.name.toLowerCase() === "free"
    );
    const freePrice = plans.prices.find((e) => e.unit_amount === 0);

    const customer = await stripe.customers.create({
      name: name,
      email: email,
    });
    // console.log(freePlan?.metadata);
    const sub = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: freePrice?.id,
        },
      ],
      metadata: freePlan?.metadata,
    });

    return sub;
  }
}
