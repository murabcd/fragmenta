"use client";

import { FormList } from "./_components/form-list";

import { EmptyOrgState } from "@/components/empty-org-state";

import { useOrganization } from "@clerk/nextjs";

const HomePage = () => {
  const { organization } = useOrganization();

  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? <EmptyOrgState /> : <FormList orgId={organization.id} />}
    </div>
  );
};

export default HomePage;

// Remove this later
// <div className="h-full p-4 space-y-2">
