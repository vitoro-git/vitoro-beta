import { auth } from "@/features/auth/config/server";
import { hasAdditionalInfo } from "@/lib/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AdditionalInfoGuard({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session === null) redirect("/signin");
  if (hasAdditionalInfo(session.user)) redirect("/app");
  return children;
}
