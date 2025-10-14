"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BetterAuthActionButton } from "@/features/auth/components/better-auth-action-button";
import { authClient } from "@/features/auth/config/client";
import { Session } from "better-auth";
import { Monitor, Smartphone, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { UAParser } from "ua-parser-js";

type SessionManagementProps = {
  sessions: Session[];
  currentSessionToken: string;
};

export default function SessionManagement({
  sessions,
  currentSessionToken,
}: SessionManagementProps) {
  const router = useRouter();

  const otherSessions = sessions.filter((s) => s.token !== currentSessionToken);
  const currentSession = sessions.find((s) => s.token === currentSessionToken);

  function revokeOtherSessions() {
    return authClient.revokeOtherSessions(undefined, {
      onSuccess: () => {
        router.refresh();
      },
    });
  }

  return (
    <div className="space-y-6">
      {currentSession && (
        <SessionCard session={currentSession} isCurrentSession />
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">Other Active Sessions</h3>
          {otherSessions.length > 0 && (
            <BetterAuthActionButton
              variant="destructive"
              size="sm"
              action={revokeOtherSessions}
            >
              Revoke Other Sessions
            </BetterAuthActionButton>
          )}
        </div>

        {otherSessions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-muted-foreground text-center">
              No other active sessions
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {otherSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SessionCard({
  session,
  isCurrentSession = false,
}: {
  session: Session;
  isCurrentSession?: boolean;
}) {
  const router = useRouter();
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

  function getBrowserInformation() {
    if (userAgentInfo == null) return "Unknown Device";
    if (userAgentInfo.browser.name == null && userAgentInfo.os.name == null) {
      return "Unknown Device";
    }

    if (userAgentInfo.browser.name == null) return userAgentInfo.os.name;
    if (userAgentInfo.os.name == null) return userAgentInfo.browser.name;

    return `${userAgentInfo.browser.name}, ${userAgentInfo.os.name}`;
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  function revokeSession() {
    return authClient.revokeSession(
      {
        token: session.token,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  }

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle>{getBrowserInformation()}</CardTitle>
        {isCurrentSession && <Badge>Current Session</Badge>}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {userAgentInfo?.device.type === "mobile" ? (
              <Smartphone />
            ) : (
              <Monitor />
            )}
            <div>
              <p className="text-muted-foreground text-sm">
                Created: {formatDate(session.createdAt)}
              </p>
              <p className="text-muted-foreground text-sm">
                Expires: {formatDate(session.expiresAt)}
              </p>
            </div>
          </div>
          {!isCurrentSession && (
            <BetterAuthActionButton
              variant="destructive"
              size="sm"
              action={revokeSession}
              successMessage="Session revoked"
            >
              <Trash2 />
            </BetterAuthActionButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
