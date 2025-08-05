import { v } from "convex/values";

import { internalAction } from "../_generated/server";

import { InviteEmail } from "./userinvite";

import { Resend } from "resend";

export const sendEmail = internalAction({
	args: {
		orgId: v.id("organizations"),
		name: v.string(),
		email: v.string(),
		role: v.union(v.literal("admin"), v.literal("member")),
		token: v.string(),
	},
	handler: async (_ctx, args) => {
		const resend = new Resend(process.env.RESEND_API_KEY);

		const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/register/invite?token=${args.token}`;

		const { error } = await resend.emails.send({
			from: "Fragmenta, Inc. <murad@fragmenta.ai>",
			to: [args.email],
			subject: "Invitation to join organization",
			react: InviteEmail({
				name: args.name,
				email: args.email,
				role: args.role,
				inviteLink: inviteUrl,
			}),
		});

		if (error) {
			throw new Error(error.message);
		}
	},
});
