import z from "zod";
import {
  uploadedFoundationalFollowupSchema,
  uploadedFoundationalSchema,
  uploadedQBankSchema,
} from "./schemas";

export type Table = "qbank" | "foundational" | "foundational-followup";

export type UploadedQBank = z.infer<typeof uploadedQBankSchema>;
export type UploadedFoundationalFollowup = z.infer<
  typeof uploadedFoundationalFollowupSchema
>;
export type UploadedFoundational = z.infer<typeof uploadedFoundationalSchema>;
