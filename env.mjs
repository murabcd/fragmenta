import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		AUTH_GOOGLE_ID: z.string(),
		AUTH_GOOGLE_SECRET: z.string(),
		AUTH_RESEND_KEY: z.string(),
		RESEND_API_KEY: z.string(),
		OPENAI_API_KEY: z.string(),
	},
	client: {
		NEXT_PUBLIC_CONVEX_URL: z.url(),
	},
	runtimeEnv: {
		NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
		AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
		AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
		AUTH_RESEND_KEY: process.env.AUTH_RESEND_KEY,
		RESEND_API_KEY: process.env.RESEND_API_KEY,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
	},
});
