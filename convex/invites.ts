import { v } from "convex/values";

import { internalAction } from "./_generated/server";

import { Resend } from "resend";

export const sendEmail = internalAction({
  args: {
    email: v.string(),
    orgId: v.id("organizations"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: "murad@fragmenta.ai",
      to: [args.email],
      subject: "Invitation to join organization",
      html: `<p>You've been invited to join an organization as a ${args.role}. Click here to accept the invitation.</p>`,
    });

    if (error) {
      throw new Error(error.message);
    }
  },
});
