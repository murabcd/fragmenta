"use client";

import { Loader } from "lucide-react";

import { FormItem } from "./_components/form-item";

import { EmptyOrgState } from "@/components/empty-org-state";

import { useOrganization } from "@/hooks/use-organization";

const HomePage = () => {
  const { organization, isLoading } = useOrganization();

  if (isLoading) {
    return (
      <div className="flex-1 h-[calc(100vh-80px)] flex items-center justify-center">
        <Loader className="h-6 w-6 text-muted-foreground animate-spin duration-700" />
      </div>
    );
  }

  return (
    <div className="flex-1 h-[calc(100vh-80px)] p-6">
      {!organization?._id ? <EmptyOrgState /> : <FormItem orgId={organization._id} />}
    </div>
  );
};

export default HomePage;
