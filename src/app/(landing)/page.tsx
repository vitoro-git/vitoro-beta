import GradientTitle from "@/components/gradient-title";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/features/auth/config/server";
import { headers } from "next/headers";
import LandingBackground from "@/features/landing/components/background";
import { HEADER_HEIGHT, INNER_WIDTH } from "@/features/landing/constants";
import VitoAnimation from "@/components/vito/vito-animation";

export default async function LandingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isLoggedIn = session !== null;

  return (
    <main className="bg-secondary h-full overflow-y-auto scroll-smooth">
      <LandingBackground />
      <Hero isLoggedIn={isLoggedIn} />
      <QuestionSection />
      <FeaturesSection />
      <CallToActionSection isLoggedIn={isLoggedIn} />
    </main>
  );
}

function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section id="hero" className="z-10 relative place-items-center grid h-full">
      <div
        className="flex flex-col items-center gap-6"
        style={{ paddingTop: HEADER_HEIGHT }}
      >
        {/* Vito Animation */}
        <VitoAnimation size={250} className="z-1 mb-2" />
        <h1 className="z-1 font-bold text-4xl text-center">
          Your <span className="text-primary">Personal</span> Board Prep{" "}
          <span className="text-primary">Tutor</span>
        </h1>
        <div className="z-1 space-y-1 max-w-lg text-muted-foreground text-center">
          <p>Built with the help of a 273 Step 2 Scorer</p>
          <p>Gain the confidence you deserve</p>
        </div>
        <div className="flex gap-4 mt-2">
          <Button asChild className="z-1">
            <Link href={isLoggedIn ? "/app" : "/register"}>
              <span className="text-background">Start learning</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="z-1">
            <Link href="#features">See how it works</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function QuestionSection() {
  return (
    <section className="z-10 relative place-items-center grid h-full">
      <GradientTitle text="HOW?" className="z-1 font-black text-9xl" />
    </section>
  );
}

function FeaturesSection() {
  return (
    <section
      id="features"
      className="z-10 relative flex flex-col justify-center items-center gap-8 h-full"
    >
      <h2 className="mb-4 font-bold text-white text-4xl text-center">
        See for yourself...
      </h2>
      <div className="flex justify-center px-8 w-full">
        <div
          style={{ maxWidth: INNER_WIDTH * 0.8 }}
          className="flex justify-center w-full"
        >
          <video
            className="z-1 shadow-2xl border border-border rounded-lg w-full max-w-4xl h-auto"
            controls
            preload="metadata"
            style={{
              maxHeight: "60vh",
              aspectRatio: "16/9",
            }}
          >
            <track kind="captions" />
            <source src="/demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}

function CallToActionSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="z-10 relative place-items-center grid bg-background py-24 border-t">
      <div
        style={{ maxWidth: INNER_WIDTH * 0.4 }}
        className="flex flex-col items-center gap-8"
      >
        <p className="font-bold text-4xl">
          Ready to <span className="text-primary">Excel</span>?
        </p>
        <p className="text-muted-foreground text-center">
          If the &quot;tried and true&quot; isn&apos;t working for you,
          it&apos;s time to try something new.
        </p>
        <Button asChild>
          <Link href={isLoggedIn ? "/" : "/register"}>
            <span className="text-background">Start your preparation</span>
          </Link>
        </Button>
      </div>
    </section>
  );
}
