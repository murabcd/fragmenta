import { Hono } from "hono";
import { HonoWithConvex, HttpRouterWithHono } from "convex-helpers/server/hono";
import { ActionCtx } from "./_generated/server";
import { cors } from "hono/cors";

import { api } from "./_generated/api";

import { openai } from "@ai-sdk/openai";
import { StreamData, StreamingTextResponse, streamText } from "ai";

const app: HonoWithConvex<ActionCtx> = new Hono();

app.use("/api/*", cors());

app.post("/api/generate", async (c) => {
  const { prompt, formId } = await c.req.json();

  const result = await streamText({
    model: openai("gpt-4o"),
    maxTokens: 2000,
    prompt: `Generate a list of 5 questions based on the following input.
    
    Guidelines:
    - Return the result as a JSON array of question objects.
    - Each question object should have 'title', 'description', and 'type' properties.
    - The 'type' should be one of: 'Start screen', 'End screen', 'Short text', 'Long text', 'Yes/no choice', 'Single choice', 'Multiple choice', or 'Rating'.
    - Always include exactly one 'Start screen' and one 'End screen' question in the returned list.
    - Ensure the questions are relevant to the input and cover key aspects.
    - Keep the question titles concise and the descriptions clear and informative.
    - Do not include any markdown formatting or code block syntax in the response.
    
    Input: ${prompt}
    
    Output the result as a JSON array only, with no additional text.`,
  });

  const data = new StreamData();

  data.append("Call started");

  const stream = result.toAIStream({
    async onFinal(completion) {
      const parsed = JSON.parse(completion);
      await c.env.runMutation(api.questions.generate, {
        questions: parsed,
        formId,
      });
      data.append("Call completed");
      data.close();
    },
  });

  return new StreamingTextResponse(stream, {}, data);
});

export default new HttpRouterWithHono(app);
