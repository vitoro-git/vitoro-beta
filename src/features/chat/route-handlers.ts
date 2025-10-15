import { Gemini } from "@/ai/gemini";
import { db } from "@/db/db";
import { NextResponse } from "next/server";
import z from "zod";
import { chatLog } from "@/db/schemas/logs";
import { auth } from "../auth/config/server";
import { headers } from "next/headers";

// Non-Stream

const ChatRequestBodySchema = z.object({
  prompts: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
      type: z.enum(["text"]),
    })
  ),
});

export async function handleChatRequest(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return new NextResponse(null, { status: 401 });
    }

    const body = await req.json();
    const parsed = ChatRequestBodySchema.safeParse(body);
    if (!parsed.success) {
      console.error(parsed.error);
      return new NextResponse(null, { status: 400 });
    }

    const llm = new Gemini();
    const output = await llm.prompt(parsed.data.prompts);

    const prompt = parsed.data.prompts.map((p) => p.content).join("\n");

    await db.insert(chatLog).values({
      userId: session.user.id,
      prompt,
      iTokens: output.inputTokens,
      oTokens: output.outputTokens,
      response: output.text,
    });
    return new NextResponse(JSON.stringify(output), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(null, { status: 500 });
  }
}

// Stream

const ChatStreamedRequestBodySchema = z.object({
  prompts: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
      type: z.enum(["text"]),
    })
  ),
});

export async function handleChatStreamedRequest(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return new NextResponse(null, { status: 401 });
    }

    const body = await req.json();
    const parsed = ChatStreamedRequestBodySchema.safeParse(body);
    if (!parsed.success) {
      console.error(parsed.error);
      return new NextResponse(null, { status: 400 });
    }

    const llm = new Gemini();
    const stream = await llm.promptStreamed(parsed.data.prompts);
    let output = "";
    let oTokens = 0;
    const prompt = parsed.data.prompts.map((p) => p.content).join("\n");

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await stream.next();
          if (done) {
            await db.insert(chatLog).values({
              userId: session.user.id,
              prompt,
              iTokens: oTokens,
              oTokens,
              response: output,
            });
            break;
          }

          oTokens += value.outputTokens;
          output += value.text;
          controller.enqueue(encoder.encode(JSON.stringify(value)));
        }
        controller.close();
      },
    });

    return new NextResponse(readableStream, { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(null, { status: 500 });
  }
}
