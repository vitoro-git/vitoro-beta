"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BetterAuthActionButton } from "@/features/auth/components/better-auth-action-button";
import { authClient } from "@/features/auth/config/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [timeToNextResend, setTimeToNextResend] = useState(30);
  const interval = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    startEmailVerificationCountdown();
  }, []);

  function startEmailVerificationCountdown(time = 30) {
    setTimeToNextResend(time);

    clearInterval(interval.current);
    interval.current = setInterval(() => {
      setTimeToNextResend((t) => {
        const newT = t - 1;

        if (newT <= 0) {
          clearInterval(interval.current);
          return 0;
        }
        return newT;
      });
    }, 1000);
  }

  if (!email) {
    return (
      <div className="space-y-4">
        <p className="mt-2 text-muted-foreground text-sm">No email provided</p>
      </div>
    );
  }

  return (
    <main className="place-items-center grid h-full">
      <Card className="w-md">
        <CardContent>
          <div className="space-y-4">
            <p className="mt-2 text-muted-foreground text-sm">
              We sent you a verification link. Please check your email and click
              the link to verify your account.
            </p>

            <BetterAuthActionButton
              variant="outline"
              className="w-full"
              successMessage="Verification email sent!"
              disabled={timeToNextResend > 0}
              action={() => {
                startEmailVerificationCountdown();
                return authClient.sendVerificationEmail({
                  email,
                  callbackURL: "/app",
                });
              }}
            >
              {timeToNextResend > 0
                ? `Resend Email (${timeToNextResend})`
                : "Resend Email"}
            </BetterAuthActionButton>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
