import { db } from "@/db/db";
import {
  foundationalFollowup,
  foundationalQuestion,
  foundationalSession,
  qbankSession,
} from "@/db/schema";
import { auth } from "@/features/auth/config/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq, desc, and, isNull, countDistinct } from "drizzle-orm";
import GradientTitle from "@/components/gradient-title";
import Link from "next/link";
import { FoundationalQuestion, FoundationalSession } from "@/types";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ArrowRight, Layers, Target } from "lucide-react";
import QBankSessionItem from "@/features/qbank/components/qbank-session-item";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function getSessions(userId: string) {
  const [qbank, foundational] = await Promise.all([
    db
      .select()
      .from(qbankSession)
      .where(eq(qbankSession.userId, userId))
      .orderBy(desc(qbankSession.createdAt)),
    db
      .select({
        session: foundationalSession,
        question: foundationalQuestion,
        followups: countDistinct(foundationalFollowup.id),
      })
      .from(foundationalSession)
      .innerJoin(
        foundationalQuestion,
        eq(foundationalSession.baseId, foundationalQuestion.id)
      )
      .innerJoin(
        foundationalFollowup,
        eq(foundationalFollowup.questionId, foundationalQuestion.id)
      )
      .where(
        and(
          eq(foundationalSession.userId, userId),
          isNull(foundationalSession.completedAt)
        )
      )
      .groupBy(foundationalQuestion.id, foundationalSession.id),
  ]);
  return { qbank, foundational };
}

export default async function HistoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session === null) redirect("/signin");
  const { qbank, foundational } = await getSessions(session.user.id);

  return (
    <main className="flex flex-col items-center gap-8 p-8 h-full">
      <GradientTitle text="History" className="font-black text-4xl" />
      <div className="flex-1 gap-8 grid grid-cols-2 w-full">
        <section className="flex flex-col gap-2">
          {qbank.length > 0 && (
            <p className="mb-6 ml-8 font-semibold text-lg">
              Question Bank Sessions
            </p>
          )}
          {qbank.length === 0 && <EmptyQBankView />}
          {qbank.map((s) => (
            <QBankSessionItem key={s.id} session={s} />
          ))}
        </section>
        <section className="flex flex-col gap-2">
          {foundational.length > 0 && (
            <p className="mb-6 ml-8 font-semibold text-lg">
              Foundational Sessions
            </p>
          )}
          {foundational.length === 0 && <EmptyFoundationalView />}
          <div className="gap-2 grid grid-cols-2">
            {foundational.map((s) => (
              <FoundationalSessionItem
                key={s.session.id}
                session={s.session}
                question={s.question}
                followups={s.followups}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

type FoundationalSessionItemProps = {
  session: FoundationalSession;
  question: FoundationalQuestion;
  followups: number;
};

function FoundationalSessionItem({
  session: s,
  question: q,
  followups: f,
}: FoundationalSessionItemProps) {
  const answered =
    (s.shortResponse ? 1 : 0) + s.answers.filter((a) => a !== "").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{q.shelf}</CardTitle>
        <CardDescription>
          Answered {answered} / {1 + f}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline">
          <Link href={`/app/foundational/${q.shelf}`}>Continue</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function EmptyQBankView() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Target />
        </EmptyMedia>
        <EmptyTitle>Question Bank Sessions</EmptyTitle>
        <EmptyDescription>
          You have not started any question bank sessions yet.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href="/app/qbank" className="flex items-center gap-2">
          <span>Start a question bank session</span>
          <ArrowRight size={16} />
        </Link>
      </EmptyContent>
    </Empty>
  );
}

function EmptyFoundationalView() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Layers />
        </EmptyMedia>
        <EmptyTitle>Foundational Sessions</EmptyTitle>
        <EmptyDescription>
          You don&apos;t currently have any active foundational sessions.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href="/app/foundational" className="flex items-center gap-2">
          <span>Start a foundational session</span>
          <ArrowRight size={16} />
        </Link>
      </EmptyContent>
    </Empty>
  );
}
