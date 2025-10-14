import { auth } from "@/features/auth/config/server";
import ContactForm from "@/features/landing/components/contact-form";
import { INNER_WIDTH } from "@/features/landing/constants";
import { headers } from "next/headers";

export default async function ContactPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <main
      style={{ maxWidth: INNER_WIDTH }}
      className="place-items-center grid grid-cols-2 mx-auto h-full"
    >
      <ContactForm user={session?.user} />
      {/* TODO: maybe add socials */}
    </main>
  );
}
