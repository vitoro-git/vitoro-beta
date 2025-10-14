import { db } from "@/db/db";
import {
  qbankSession,
  flashcard,
  flashcardFolder,
  qbankQuestion,
  answeredQBank,
} from "@/db/schema";
import { auth } from "@/features/auth/config/server";
import { eq, desc, countDistinct } from "drizzle-orm";
import { headers } from "next/headers";
import { capitalize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Target, Weight } from "lucide-react";
import GradientTitle from "@/components/gradient-title";

async function getQBankStats(userId: string) {
  const questions = await db
    .select({
      question: qbankQuestion,
      isCorrect: answeredQBank.isCorrect,
    })
    .from(qbankQuestion)
    .leftJoin(answeredQBank, eq(answeredQBank.questionId, qbankQuestion.id))
    .where(eq(answeredQBank.userId, userId));

  const systemMap = new Map<string, { correct: number; total: number }>();

  for (const question of questions) {
    for (const system of question.question.systems) {
      const entry = systemMap.get(system) || { correct: 0, total: 0 };
      entry.total++;
      entry.correct += question.isCorrect ? 1 : 0;
      systemMap.set(system, entry);
    }
  }

  const weakAreas = Array.from(systemMap.entries())
    .map(([system, { correct, total }]) => ({
      system,
      correct,
      total,
      accuracy: total > 0 ? Math.floor((correct / total) * 100) : 0,
    }))
    .toSorted((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const total = questions.length;
  const correct = questions.filter((q) => q.isCorrect).length;
  const accuracy = total > 0 ? Math.floor((correct / total) * 100) : 0;

  return {
    total,
    correct,
    accuracy,
    weakAreas,
  };
}

async function getUserData() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const [sessions, [{ count: flashcards }], qBankStats] = await Promise.all([
    db
      .select()
      .from(qbankSession)
      .where(eq(qbankSession.userId, session.user.id))
      .orderBy(desc(qbankSession.createdAt))
      .limit(4),
    db
      .select({ count: countDistinct(flashcard.id) })
      .from(flashcard)
      .leftJoin(flashcardFolder, eq(flashcard.folderId, flashcardFolder.id))
      .where(eq(flashcardFolder.userId, session.user.id)),
    getQBankStats(session.user.id),
  ]);

  const timeSinceJoin = Date.now() - session.user.createdAt.getTime();
  const daysSinceJoin = Math.floor(timeSinceJoin / 1000 / 60 / 60 / 24);
  const questionsPerDay = (qBankStats.total / daysSinceJoin).toFixed(2);

  return {
    user: session.user,
    questionsPerDay,
    qBankStats,
    flashcardCount: flashcards,
    recentSessions: sessions.map((s) => ({
      id: s.id,
      name: s.name,
      questionCount: s.questionIds.length,
    })),
  };
}

export type UserData = Awaited<ReturnType<typeof getUserData>>;

export default async function AppHomePage() {
  const data = await getUserData();

  return (
    <main className="space-y-10 p-6">
      <div className="space-y-2">
        <GradientTitle
          text={`Welcome back, ${data.user.name.split(" ")[0]}!`}
          className="font-bold text-4xl"
        />
        <p className="text-muted-foreground">
          Keep up the good work for{" "}
          {capitalize(data.user.exam?.replace("-", " ") ?? "")}.
        </p>
      </div>

      <div className="flex gap-2">
        <Button asChild>
          <Link href="/app/qbank">
            <span className="text-background">Question Bank</span>
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/app/foundational">Foundations</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/app/flashcards">Flashcards</Link>
        </Button>
      </div>

      <div className="gap-4 grid md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1">
              <Target size={16} />
              <span>Accuracy</span>
            </CardTitle>
            <CardDescription>Overall performance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-primary text-3xl">
              {data.qBankStats.accuracy}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1">
              <Weight size={16} />
              <span>Study Volume</span>
            </CardTitle>
            <CardDescription>Questions Answered Per Day</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-3xl">{data.questionsPerDay}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1">
              <CreditCard size={16} />
              <span>Flashcards</span>
            </CardTitle>
            <CardDescription>Total created</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-3xl">{data.flashcardCount}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 font-semibold text-lg">Recent Sessions</h2>
        <div className="gap-4 grid grid-cols-4">
          {data.recentSessions.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No sessions yet. Start one today!
            </p>
          )}
          {data.recentSessions.map((session) => (
            <Card
              key={session.id}
              className="flex justify-between items-center p-4"
            >
              <CardContent className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center">
                  <p className="font-medium">{session.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {session.questionCount} questions
                  </p>
                </div>
                <Button variant="outline">Review</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-semibold text-lg">Top Weak Areas</h2>
        {data.qBankStats.weakAreas.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            None identified yet — keep practicing!
          </p>
        ) : (
          <div className="gap-3 grid sm:grid-cols-2 md:grid-cols-3">
            {data.qBankStats.weakAreas.map((area) => (
              <Card key={area.system}>
                <CardHeader>
                  <CardTitle>{area.system}</CardTitle>
                  <CardDescription>{area.accuracy}% correct</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={area.accuracy} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
