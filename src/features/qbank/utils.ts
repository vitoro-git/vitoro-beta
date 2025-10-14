import { QBankSession } from "@/types";

export function getRemainingSeconds(session: QBankSession) {
  const timeAlotted = session.questionIds.length * 1.5 * 60 * 1000;
  const endsAt = timeAlotted + session.createdAt.getTime();
  return Math.floor((endsAt - Date.now()) / 1000);
}
