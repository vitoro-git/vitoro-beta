import { db } from "@/db/db";
import Stripe from "stripe";
import { singlePurchase } from "./schema";

export async function handleStripeEvents(event: Stripe.Event) {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Verify payment is successful and not a subscription
    if (session.payment_status === "paid" && !session.subscription) {
      console.log("✅ One-time Checkout payment succeeded:", session.id);
      console.log("Customer:", session.customer_details?.email);
      console.log("Amount total:", session.amount_total);

      const customerId = session.customer as string | undefined;
      const priceId = session.line_items?.data.at(0)?.price?.id;
      if (!customerId || !priceId) {
        return;
      }

      await db.insert(singlePurchase).values({
        customerId,
        priceId,
      });
    }
  } else if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.warn("❌ Payment failed:", paymentIntent.id);
  }
}
