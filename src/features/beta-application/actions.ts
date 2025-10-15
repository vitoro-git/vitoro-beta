"use server";

import { db } from "@/db/db";
import { betaApplication } from "@/db/schemas/beta";
import { eq } from "drizzle-orm";

export async function createBetaApplication(email: string) {
  await db.insert(betaApplication).values({ email });
}

export async function approveBetaApplication(id: string) {
  await db
    .update(betaApplication)
    .set({ approvedAt: new Date() })
    .where(eq(betaApplication.id, id));
}

export async function rejectBetaApplication(id: string) {
  await db
    .update(betaApplication)
    .set({ rejectedAt: new Date() })
    .where(eq(betaApplication.id, id));
}
