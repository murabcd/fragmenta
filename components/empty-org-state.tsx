"use client";

import { PartyPopper } from "lucide-react";

import { useSession } from "next-auth/react";

import { UserOrg } from "@/components/user-org";

export const EmptyOrgState = () => {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <PartyPopper className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-semibold mt-6">Welcome, {session.user.name}</h2>
      <p className="text-muted-foreground text-sm mt-2">
        You haven&apos;t created any organizations yet.
      </p>
      <div className="mt-6">
        <UserOrg />
      </div>
    </div>
  );
};
