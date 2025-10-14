"use client";

import { BetterAuthActionButton } from "@/features/auth/components/better-auth-action-button";
import { authClient } from "@/features/auth/config/client";

type SetPasswordButtonProps = {
  email: string;
};

export default function SetPasswordButton({ email }: SetPasswordButtonProps) {
  return (
    <BetterAuthActionButton
      variant="outline"
      successMessage="Password reset email sent"
      action={() => {
        return authClient.requestPasswordReset({
          email,
          redirectTo: "/auth/reset-password",
        });
      }}
    >
      Send Password Reset Email
    </BetterAuthActionButton>
  );
}
