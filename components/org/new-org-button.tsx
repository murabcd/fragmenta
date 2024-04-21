"use client";

import { Plus } from "lucide-react";

import { CreateOrganization } from "@clerk/nextjs";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const NewOrgButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center p-2 cursor-pointer text-sm font-basic hover:bg-secondary">
          <Plus className="mr-2 w-4 h-4" />
          New organization
        </div>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none max-w-[470px]">
        <CreateOrganization routing="hash" />
      </DialogContent>
    </Dialog>
  );
};
