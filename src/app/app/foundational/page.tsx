import GradientTitle from "@/components/gradient-title";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { auth } from "@/features/auth/config/server";
import { fetchFoundationals } from "@/features/foundational/actions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type FoundationalItemType = {
  shelf: string;
  step: "step-1" | "step-2";
  availableCount: number;
  answeredCount: number;
};

export default async function FoundationalPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session === null) redirect("/signin");
  const foundationals = await fetchFoundationals(session.user.id);
  const step = session.user.exam!;

  return (
    <main className="flex flex-col items-center gap-8 p-8 h-full overflow-auto">
      <GradientTitle text="Foundational" className="font-black text-4xl" />
      <div className="space-y-8 w-full">
        <section className="space-y-4">
          <p className="ml-8 font-semibold text-lg">
            {step === "step-1" ? "Step 1" : "Step 2"}
          </p>
          <div className="gap-2 grid grid-cols-4">
            {foundationals
              .filter(
                (f) => f.step === (step === "step-1" ? "step-1" : "step-2")
              )
              .map((f) => (
                <FoundationalItem key={f.shelf} item={f} />
              ))}
          </div>
        </section>
        <section className="space-y-4">
          <p className="ml-8 font-semibold text-lg">
            {step === "step-1" ? "Step 2" : "Step 1"}
          </p>
          <div className="gap-2 grid grid-cols-4">
            {foundationals
              .filter(
                (f) => f.step === (step === "step-1" ? "step-2" : "step-1")
              )
              .map((f) => (
                <FoundationalItem key={f.shelf} item={f} />
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}

type FoundationalItemProps = {
  item: FoundationalItemType;
};

function FoundationalItem({ item }: FoundationalItemProps) {
  return (
    <Link href={`/app/foundational/${item.shelf}`}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{item.shelf}</CardTitle>
          <CardDescription>
            Answered {item.answeredCount} / {item.availableCount}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
