"use client";

// import type { Session, User } from "better-auth";
import { createContext, useContext, type ReactNode } from "react";
import { auth } from "./config/server";

type Session = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>["session"];
type User = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>["user"];

type SessionContextType = {
  session: Session;
  user: User;
};

export const SessionContext = createContext<SessionContextType>({
  session: {} as Session,
  user: {} as User,
});

type SessionProviderProps = {
  children: ReactNode;
  session: Session;
  user: User;
};

export default function SessionProvider({
  children,
  session,
  user,
}: SessionProviderProps) {
  return (
    <SessionContext.Provider value={{ session, user }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
