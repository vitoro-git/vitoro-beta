import { auth } from "@/features/auth/config/server";
import Header from "@/features/landing/components/header";
import { HEADER_HEIGHT } from "@/features/landing/constants";
import { headers } from "next/headers";
import { ReactNode } from "react";

export default async function LandingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const isLoggedIn = session !== null;

  return (
    <div style={{ paddingTop: HEADER_HEIGHT }} className="h-full">
      <Header isLoggedIn={isLoggedIn} />
      {children}
    </div>
  );
}
