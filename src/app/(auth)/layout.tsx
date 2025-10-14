import { auth } from "@/features/auth/config/server";
import { hasAdditionalInfo } from "@/lib/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session !== null && hasAdditionalInfo(session.user)) redirect("/app");
  return children;
}
