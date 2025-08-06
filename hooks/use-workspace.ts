import { useEffect } from "react";

import { create } from "zustand";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type Workspace = {
	_id?: Id<"workspaces">;
	name?: string;
	slug?: string;
	role: "owner" | "admin" | "member";
	imageUrl?: string;
	ownerId?: string;
	_creationTime?: number;
};

type WorkspaceStore = {
	currentWorkspace: Workspace | null;
	setCurrentWorkspace: (workspace: Workspace | null) => void;
};

const useWorkspaceStore = create<WorkspaceStore>((set) => ({
	currentWorkspace: null,
	setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
}));

export function useWorkspace() {
	const workspaces = useQuery(api.workspaces.getUserWorkspaces);
	const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore();

	const isLoading = workspaces === undefined;

	useEffect(() => {
		if (
			!isLoading &&
			workspaces &&
			workspaces.length > 0 &&
			!currentWorkspace
		) {
			setCurrentWorkspace(workspaces[0]);
		}
	}, [isLoading, workspaces, currentWorkspace, setCurrentWorkspace]);

	return {
		workspace: currentWorkspace,
		isLoading,
		workspaces,
		setCurrentWorkspace: setCurrentWorkspace,
		userMemberships: {
			data: workspaces,
			isLoading,
		},
	};
}
