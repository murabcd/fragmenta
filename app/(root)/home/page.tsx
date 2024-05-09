"use client";

import { FormItem } from "./_components/form-item";

import { EmptyOrgState } from "@/components/empty-org-state";

import { useOrganization } from "@clerk/nextjs";

const HomePage = () => {
  const { organization } = useOrganization();

  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? <EmptyOrgState /> : <FormItem orgId={organization.id} />}
    </div>
  );
};

export default HomePage;
