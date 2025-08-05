import { useEffect } from "react";

import { create } from "zustand";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type Organization = {
	_id?: Id<"organizations">;
	name?: string;
	slug?: string;
	role: "owner" | "admin" | "member";
	imageUrl?: string;
	ownerId?: string;
	_creationTime?: number;
};

type OrganizationStore = {
	currentOrg: Organization | null;
	setCurrentOrg: (org: Organization | null) => void;
};

const useOrganizationStore = create<OrganizationStore>((set) => ({
	currentOrg: null,
	setCurrentOrg: (org) => set({ currentOrg: org }),
}));

export function useOrganization() {
	const organizations = useQuery(api.organizations.getUserOrganizations);
	const { currentOrg, setCurrentOrg } = useOrganizationStore();

	const isLoading = organizations === undefined;

	useEffect(() => {
		if (
			!isLoading &&
			organizations &&
			organizations.length > 0 &&
			!currentOrg
		) {
			setCurrentOrg(organizations[0]);
		}
	}, [isLoading, organizations, currentOrg, setCurrentOrg]);

	return {
		organization: currentOrg,
		isLoading,
		organizations,
		setCurrentOrganization: setCurrentOrg,
		userMemberships: {
			data: organizations,
			isLoading,
		},
	};
}
