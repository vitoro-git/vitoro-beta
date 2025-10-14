import { db } from "@/db/db";
import {
  uploadedFoundational,
  uploadedFoundationalFollowup,
  uploadedQBank,
} from "@/db/schema";
import QuestionUploadForm from "@/features/upload/components/upload-form";
import { count } from "drizzle-orm";

export default async function AdminUploadPage() {
  const [
    [{ count: qbankCount }],
    [{ count: foundationalCount }],
    [{ count: followupCount }],
  ] = await Promise.all([
    db.select({ count: count() }).from(uploadedQBank),
    db.select({ count: count() }).from(uploadedFoundational),
    db.select({ count: count() }).from(uploadedFoundationalFollowup),
  ]);
  return (
    <QuestionUploadForm
      qbank={qbankCount}
      foundational={foundationalCount}
      foundationalFollowup={followupCount}
    />
  );
}
