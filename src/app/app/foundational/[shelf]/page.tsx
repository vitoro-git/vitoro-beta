import { auth } from "@/features/auth/config/server";
import { fetchFoundationalSession } from "@/features/foundational/actions";
import CompletedPage from "@/features/foundational/components/completed-page";
import FoundationalQuestionView from "@/features/foundational/components/foundational-question-view";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type FoundationalPageProps = {
  params: Promise<{ shelf: string }>;
};

export default async function FoundationalPage({
  params,
}: FoundationalPageProps) {
  const [{ shelf }, authSession] = await Promise.all([
    params,
    auth.api.getSession({ headers: await headers() }),
  ]);
  const parsedShelf = decodeURIComponent(shelf);
  if (!parsedShelf) return notFound();
  const session = await fetchFoundationalSession(
    parsedShelf,
    authSession!.user.id
  );
  if (!session)
    return <CompletedPage shelf={parsedShelf} userId={authSession!.user.id} />;

  return (
    <FoundationalQuestionView
      session={session.session}
      question={session.question}
      followups={session.followups}
    />
  );
}
