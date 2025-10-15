import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/db";
import { nextCookies } from "better-auth/next-js";
import { sendPasswordResetEmail } from "../email/password-reset";
import { sendEmailVerificationEmail } from "../email/email-verification";
import { admin as adminPlugin } from "better-auth/plugins/admin";
import { ac, admin, user } from "../components/permissions";
import { stripe } from "@better-auth/stripe";
import { SUBSCRIPTIONS } from "../payment/products";
import { handleStripeEvents } from "../payment/events";
import { generateColor } from "@/lib/utils";
import Stripe from "stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export const auth = betterAuth({
  appName: "Vitoro - Beta",
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      betaApproved: { type: "boolean", required: true, defaultValue: false }, // BETA ONLY
      color: { type: "string", required: true },
      gradYear: { type: "string", required: false },
      exam: { type: "string", required: false, enum: ["step-1", "step-2"] },
      school: { type: "string", required: false },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ user, url });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerificationEmail({ user, url });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      mapProfileToUser: () => ({ color: generateColor() }),
    },
    google: {
      prompt: "select_account",
      accessType: "offline", // to get refresh token
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      mapProfileToUser: () => ({ color: generateColor() }),
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60, // 1 minute
    },
  },
  plugins: [
    nextCookies(),
    adminPlugin({
      ac,
      roles: {
        admin,
        user,
      },
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: SUBSCRIPTIONS,
      },
      // handle single payments
      onEvent: handleStripeEvents,
    }),
  ],
  database: drizzleAdapter(db, { provider: "pg" }),
  hooks: {
    // after: createAuthMiddleware(async ctx => {
    //   if (ctx.path.startsWith("/sign-up")) {
    //     const user = ctx.context.newSession?.user ?? {
    //       name: ctx.body.name,
    //       email: ctx.body.email,
    //     }
    //     if (user != null) {
    //       await sendWelcomeEmail(user)
    //     }
    //   }
    // }),
  },
  databaseHooks: {
    // session: {
    //   create: {
    //     before: async (userSession) => {
    //       const membership = await db.query.member.findFirst({
    //         where: eq(member.userId, userSession.userId),
    //         orderBy: desc(member.createdAt),
    //         columns: { organizationId: true },
    //       });
    //       return {
    //         data: {
    //           ...userSession,
    //           activeOrganizationId: membership?.organizationId,
    //         },
    //       };
    //     },
    //   },
    // },
  },
});
