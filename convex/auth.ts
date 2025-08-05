import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import Resend from "@auth/core/providers/resend";
import { Password } from "@convex-dev/auth/providers/Password";
import type { DataModel } from "./_generated/dataModel";

const CustomPassword = Password<DataModel>({
	profile(params) {
		return {
			email: params.email as string,
			name: params.name as string,
			role: params.role as "owner" | "admin" | "member",
		};
	},
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
	providers: [Google, Resend, CustomPassword],
});
