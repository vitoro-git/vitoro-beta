import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HEADER_HEIGHT, INNER_WIDTH } from "../constants";

export default function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header
      style={{ height: HEADER_HEIGHT }}
      className="top-0 z-50 fixed flex justify-center items-center bg-background/95 border-b w-full"
    >
      <nav
        style={{ maxWidth: INNER_WIDTH }}
        className="grid grid-cols-3 w-full"
      >
        <Link href="/#hero">
          <h1 className="font-bold text-foreground text-2xl">Vitoro</h1>
        </Link>
        <ul className="flex justify-self-center items-center gap-8">
          <li>
            <Link href="/#features">
              <span className="text-muted-foreground">Features</span>
            </Link>
          </li>
          <li>
            <Link href="/#features">
              <span className="text-muted-foreground">About</span>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <span className="text-muted-foreground">Contact</span>
            </Link>
          </li>
        </ul>
        {isLoggedIn ? (
          <Button asChild className="justify-self-end w-fit">
            <Link href="/app">
              <span className="text-background">Get Started</span>
            </Link>
          </Button>
        ) : (
          <div className="flex justify-self-end gap-2 w-fit">
            <Button asChild variant="outline">
              <Link href="/signin">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                <span className="text-background">Register</span>
              </Link>
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}
