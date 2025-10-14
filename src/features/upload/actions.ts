"use server";

import { db } from "@/db/db";
import {
  UploadedFoundational,
  UploadedFoundationalFollowup,
  UploadedQBank,
} from "./types";
import {
  uploadedFoundational,
  uploadedFoundationalFollowup,
  uploadedQBank,
} from "@/db/schema";

export async function uploadQBank(data: UploadedQBank[]) {
  await db.insert(uploadedQBank).values(
    data.map((q) => ({
      ...q,
      difficulty: "medium" as const,
      yield: "medium" as const,
      rating: "pending" as const,
    }))
  );
}

export async function uploadFoundational(data: UploadedFoundational[]) {
  await db.insert(uploadedFoundational).values(data);
}

export async function uploadFoundationalFollowup(
  data: UploadedFoundationalFollowup[]
) {
  await db.insert(uploadedFoundationalFollowup).values(data);
}
