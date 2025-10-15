import { Prompt, LLMOutput } from "@/ai/llm";

export async function chatWrapperWithFetch(
  prompts: Prompt[]
): Promise<LLMOutput> {
  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ prompts }),
  });
  return await res.json();
}

export async function* chatStreamWrapperWithFetch(prompts: Prompt[]) {
  const res = await fetch("/api/chat/stream", {
    method: "POST",
    body: JSON.stringify({ prompts }),
  });
  const stream = res.body?.getReader();
  if (!stream) return;
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await stream.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const json = JSON.parse(chunk);
    yield json;
  }
}
