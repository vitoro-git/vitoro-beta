import { handleChatStreamedRequest } from "@/features/chat/route-handlers";

export async function POST(req: Request) {
  return handleChatStreamedRequest(req);
}
