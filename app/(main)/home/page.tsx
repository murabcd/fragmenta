"use client";

import { FormItem } from "./_components/form-item";

import { EmptyOrgState } from "@/components/empty-org-state";

import { useOrganization } from "@/hooks/use-organization";

const HomePage = () => {
  const { organization } = useOrganization();

  if (!organization) {
    return null;
  }

  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {organization?._id ? <FormItem orgId={organization._id} /> : <EmptyOrgState />}
    </div>
  );
};

export default HomePage;
