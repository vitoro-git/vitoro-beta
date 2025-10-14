import GradientTitle from "@/components/gradient-title";
import { auth } from "@/features/auth/config/server";
import CreateSessionForm from "@/features/qbank/components/create-session-form";
import { Step } from "@/types";
import { headers } from "next/headers";

export default async function QBankPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <main className="flex flex-col items-center gap-16 p-8 h-full">
      <GradientTitle text="Create Session" className="font-black text-4xl" />
      <CreateSessionForm
        step={session!.user.exam as Step}
        userId={session!.user.id}
      />
    </main>
  );
}
