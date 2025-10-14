import AccountIcon from "@/components/account-icon";
import { Sidenav, NavLink } from "@/components/sidenav";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/features/auth/components/logout-button";
import { auth } from "@/features/auth/config/server";
import SessionProvider from "@/features/auth/session-provider";
import { hasAdditionalInfo } from "@/lib/utils";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session === null) redirect("/signin");
  if (!hasAdditionalInfo(session.user)) redirect("/additional-info");

  return (
    <SessionProvider session={session.session} user={session.user}>
      <div className="flex h-full">
        <Sidenav
          title="Vitoro"
          bottom={
            <div className="space-y-4 mt-auto">
              <ThemeToggle />
              <Button variant="outline" asChild className="w-full">
                <Link href="/app/profile">
                  <AccountIcon className="w-6 text-xs" />
                  <span className="text-foreground">Account</span>
                </Link>
              </Button>
              <LogoutButton />
            </div>
          }
        >
          <NavLink label="Home" href="/app" icon={"home"} />
          <NavLink label="Question Bank" href="/app/qbank" icon={"qbank"} />
          <NavLink
            label="Foundational"
            href="/app/foundational"
            icon={"foundational"}
          />
          <NavLink label="History" href="/app/history" icon={"history"} />
          <NavLink
            label="Flashcards"
            href="/app/flashcards"
            icon={"flashcards"}
          />
          <NavLink label="Tutor" href="/app/tutor" icon={"tutor"} />
          {session.user.role === "admin" && (
            <NavLink label="Admin" href="/admin" icon={"admin"} />
          )}
        </Sidenav>
        <div className="flex-1 h-full">{children}</div>
      </div>
    </SessionProvider>
  );
}
