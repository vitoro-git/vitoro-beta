"use client";

import { BetterAuthActionButton } from "@/features/auth/components/better-auth-action-button";
import { authClient } from "@/features/auth/config/client";

export default function AccountDeletion() {
  return (
    <BetterAuthActionButton
      requireAreYouSure
      variant="destructive"
      className="w-full"
      successMessage="Account deletion initiated. Please check your email to confirm."
      action={() => authClient.deleteUser({ callbackURL: "/app" })}
    >
      Delete Account Permanently
    </BetterAuthActionButton>
  );
}
