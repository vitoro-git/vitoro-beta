import { createAuthClient } from "better-auth/react";
import { auth } from "./server";
import { inferAdditionalFields, adminClient } from "better-auth/client/plugins";
import { ac, admin, user } from "@/features/auth/components/permissions";
import { stripeClient } from "@better-auth/stripe/client";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({
      ac,
      roles: {
        admin,
        user,
      },
    }),
    stripeClient({
      subscription: true,
    }),
  ],
});
