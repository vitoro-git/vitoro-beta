import { auth } from "@/features/auth/config/server";
import { getSession, updateSession } from "@/features/qbank/actions";
import CompletedSession from "@/features/qbank/components/completed-session";
import InProgressSession from "@/features/qbank/components/in-progress-session";
import { getRemainingSeconds } from "@/features/qbank/utils";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function QBankSessionPage({ params }: Props) {
  const [{ id }, authSession] = await Promise.all([
    params,
    auth.api.getSession({ headers: await headers() }),
  ]);
  const { session, questions } = await getSession(id, authSession!.user.id);
  if (session === null || questions.length !== session.questionIds.length)
    return notFound();
  if (session.completedAt)
    return <CompletedSession session={session} questions={questions} />;

  if (session.mode === "timed" && getRemainingSeconds(session) <= 0) {
    await updateSession(session.id, { completedAt: new Date() });
    return <CompletedSession session={session} questions={questions} />;
  }

  return <InProgressSession session={session} questions={questions} />;
}
