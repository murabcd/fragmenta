"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ChevronDown } from "lucide-react";

import { NewOrgButton } from "./new-org-button";

import { OrgList } from "./org-list";
import { useOrganization } from "@clerk/nextjs";

interface OrgSwitcherProps {
  className?: string;
}

const OrgSwitcher = ({ className }: OrgSwitcherProps) => {
  const [open, setOpen] = useState(false);
  const { organization } = useOrganization();

  const selectedOrg = organization?.name;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select an organization"
          className={cn(
            "mx-auto w-[230px] mt-5 p-3 justify-between shadow-sm text-muted-foreground bg-primary-foreground hover:bg-primary/10 ",
            className
          )}
        >
          {selectedOrg}
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[230px] p-0">
        <OrgList />
        <NewOrgButton />
      </PopoverContent>
    </Popover>
  );
};

export default OrgSwitcher;
