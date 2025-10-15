import { handleChatRequest } from "@/features/chat/route-handlers";

export async function POST(req: Request) {
  return await handleChatRequest(req);
}
