import { NavLink, Sidenav } from "@/components/sidenav";
import { auth } from "@/features/auth/config/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session === null) redirect("/signin");
  if (session.user.role !== "admin") redirect("/app");
  return (
    <div className="flex h-full">
      <Sidenav title="Vitoro" subtitle="Admin" bottom={null}>
        <NavLink label="Admin" href="/admin" icon={"admin"} />
        <NavLink label="Upload" href="/admin/upload" icon={"upload"} />
      </Sidenav>
      <div className="flex-1 h-full">{children}</div>
    </div>
  );
}
