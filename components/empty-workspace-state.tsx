"use client";

import { useState } from "react";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { PartyPopper, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserWorkspace } from "@/components/user-workspace";

export const EmptyWorkspaceState = () => {
	const userData = useQuery(api.users.getCurrentUser);
	const [isUserWorkspaceOpen, setIsUserWorkspaceOpen] = useState(false);

	if (!userData) return null;

	return (
		<div className="h-full flex flex-col items-center justify-center">
			<div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
				<PartyPopper className="w-10 h-10" />
			</div>
			<h2 className="text-2xl font-semibold mt-6">Welcome, {userData.name}</h2>
			<p className="text-muted-foreground text-sm mt-2">
				Create a new workspace to get started.
			</p>
			<div className="mt-6">
				<Button onClick={() => setIsUserWorkspaceOpen(true)}>
					<Plus className="w-4 h-4 mr-2" />
					Create workspace
				</Button>
			</div>
			<UserWorkspace
				isOpen={isUserWorkspaceOpen}
				onOpenChange={setIsUserWorkspaceOpen}
			/>
		</div>
	);
};
