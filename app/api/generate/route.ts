import type { NextRequest } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
	try {
		const { prompt, formId } = await request.json();

		const result = await streamText({
			model: openai("gpt-4o-mini"),
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
			onFinish: async ({ text }) => {
				try {
					const parsed = JSON.parse(text);
					await convex.mutation(api.questions.generateQuestions, {
						questions: parsed,
						formId,
					});
				} catch (error) {
					console.error("Failed to parse AI response:", error);
				}
			},
		});

		return result.toTextStreamResponse();
	} catch (error) {
		console.error("AI generation error:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
