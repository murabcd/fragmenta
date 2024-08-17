"use client";

import { useState } from "react";

import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { UserOrg } from "@/components/user-org";

import { ChevronDown, Check, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

import { useOrganization } from "@/hooks/use-organization";

import { Id } from "@/convex/_generated/dataModel";

interface OrgItemProps {
  id: Id<"organizations">;
  name: string;
  slug: string;
  imageUrl: string;
  onSelect: () => void;
}

interface OrgSwitcherProps {
  className?: string;
}

const OrgItem = ({ id, name, slug, imageUrl, onSelect }: OrgItemProps) => {
  const { organization, setCurrentOrganization } = useOrganization();

  const onClick = () => {
    if (!setCurrentOrganization) return;

    if (organization?._id !== id) {
      setCurrentOrganization({
        _id: id,
        name,
        slug,
        imageUrl,
        role: "member",
      });
    }

    onSelect();
  };

  return (
    <CommandItem
      onSelect={onClick}
      className="flex items-center p-2 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent"
    >
      <Avatar className="w-5 h-5 mr-2">
        <AvatarImage
          src={imageUrl}
          alt={name}
          className="h-5 w-5 rounded-sm object-cover"
        />
      </Avatar>

      <span className="text-sm truncate flex-1">{name}</span>
      {organization?._id === id && (
        <Check className="ml-auto h-3 w-3 opacity-50 flex-shrink-0" />
      )}
    </CommandItem>
  );
};

export const OrgSwitcher = ({ className }: OrgSwitcherProps) => {
  const [open, setOpen] = useState(false);
  const [isUserOrgOpen, setIsUserOrgOpen] = useState(false);
  const { organization, userMemberships } = useOrganization();

  if (!organization) {
    return (
      <div
        className={cn(
          "mx-auto w-[230px] mt-5 p-2.5 flex justify-between items-center border rounded-md",
          className
        )}
      >
        <Skeleton className="h-5 w-[150px]" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    );
  }

  const selectedOrg = organization?.name;
  const selectedOrgImage = organization?.imageUrl;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select an organization"
            className={cn(
              "mx-auto w-[230px] mt-5 p-2 justify-between shadow-sm font-normal text-muted-foreground hover:bg-transparent",
              className
            )}
          >
            <div className="flex items-center">
              {selectedOrgImage && (
                <Avatar className="w-5 h-5 mr-2">
                  <AvatarImage
                    src={selectedOrgImage}
                    alt={selectedOrg || "Organization"}
                    className="h-5 w-5 rounded-sm object-cover"
                  />
                </Avatar>
              )}
              <span className="truncate flex-1">{selectedOrg}</span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[230px] p-0">
          <Command>
            <CommandInput placeholder="Search organization..." />
            <CommandList>
              <CommandEmpty>No organization found.</CommandEmpty>
              <CommandGroup>
                {userMemberships.data?.map((org) => (
                  <OrgItem
                    key={org._id}
                    id={org._id!}
                    name={org.name ?? ""}
                    imageUrl={org.imageUrl ?? ""}
                    slug={org.slug ?? ""}
                    onSelect={() => setOpen(false)}
                  />
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setIsUserOrgOpen(true);
                  }}
                  className="flex items-center p-2 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="text-sm">Create new organization</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <UserOrg isOpen={isUserOrgOpen} onOpenChange={setIsUserOrgOpen} />
    </>
  );
};
