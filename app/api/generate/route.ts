import { openai } from "@ai-sdk/openai";
import { StreamData, StreamingTextResponse, streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o"),
    maxTokens: 2000,
    prompt,
  });

  const data = new StreamData();

  data.append("Call started");

  const stream = result.toAIStream({
    onFinal(completion) {
      data.append("Call completed");
      data.close();
    },
  });

  return new StreamingTextResponse(stream, {}, data);
}
