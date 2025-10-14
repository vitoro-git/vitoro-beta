import { StripePlan } from "@better-auth/stripe";

// TODO: change products
export const SUBSCRIPTIONS = [
  {
    name: "basic",
    priceId: process.env.STRIPE_BASIC_PRICE_ID!,
    limits: {
      projects: 10,
    },
  },
  {
    name: "pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    limits: {
      projects: 50,
    },
  },
] as const satisfies StripePlan[];

export const SUB_TO_PRICE: Record<
  (typeof SUBSCRIPTIONS)[number]["name"],
  number
> = {
  basic: 19,
  pro: 49,
};

export const PRODUCTS = [] as const satisfies StripePlan[];

export const PROD_TO_PRICE: Record<(typeof PRODUCTS)[number]["name"], number> =
  {};
