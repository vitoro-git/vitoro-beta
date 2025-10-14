"use server";

import { redirect } from "next/navigation";
import { PRODUCTS } from "./products";
import Stripe from "stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function createCheckoutSession(
  product: (typeof PRODUCTS)[number]
) {
  const session = await stripeClient.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: product,
    // TODO: change url's
    success_url: "",
    cancel_url: "",
  });

  if (!session.url) {
    throw new Error("Failed to create session");
  }

  redirect(session.url);
}
