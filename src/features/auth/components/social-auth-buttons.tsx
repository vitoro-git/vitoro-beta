"use client";

import { BetterAuthActionButton } from "./better-auth-action-button";
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
} from "@/features/auth/config/oauth-providers";
import { authClient } from "../config/client";

export function SocialAuthButtons() {
  return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
    const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon;

    return (
      <BetterAuthActionButton
        variant="outline"
        key={provider}
        action={() => {
          return authClient.signIn.social({
            provider,
            callbackURL: "/app",
          });
        }}
      >
        <Icon />
        {SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
      </BetterAuthActionButton>
    );
  });
}
