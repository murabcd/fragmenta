"use client";

import { useOrganization } from "@/hooks/use-organization";

import { MoreHorizontal } from "lucide-react";

import { MemberActions } from "./member-actions";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const PendingInvites = () => {
	const { organization } = useOrganization();
	const pending = useQuery(api.invitations.getInvitationsByOrganization, {
		orgId: organization?._id!,
	});

	if (!pending || pending.length === 0) {
		return (
			<div className="flex justify-center items-center h-[272px]">
				<p className="text-sm text-muted-foreground">No pending invitations.</p>
			</div>
		);
	}

	return (
		<div className="w-full overflow-x-hidden h-[272px]">
			<div className="max-w-full h-full overflow-y-auto">
				<Table className="w-full table-fixed">
					<TableHeader>
						<TableRow>
							<TableHead className="w-2/4">Email</TableHead>
							<TableHead className="w-1/4">Role</TableHead>
							<TableHead className="w-1/4">Status</TableHead>
							<TableHead className="w-1/4"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{pending.map((invite) => (
							<TableRow key={invite._id}>
								<TableCell className="font-medium truncate">
									{invite.email}
								</TableCell>
								<TableCell className="capitalize text-muted-foreground">
									{invite.role}
								</TableCell>
								<TableCell className="truncate capitalize text-muted-foreground">
									{invite.status}
								</TableCell>
								<TableCell className="text-right">
									<MemberActions id={invite._id} type="invitation">
										<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</MemberActions>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
