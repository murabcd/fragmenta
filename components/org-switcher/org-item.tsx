"use client";

import Image from "next/image";

import { useOrganization, useOrganizationList } from "@clerk/nextjs";

import { Check } from "lucide-react";

interface OrgItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

export const OrgItem = ({ id, name, imageUrl }: OrgItemProps) => {
  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();

  const isActive = organization?.id === id;

  const onClick = () => {
    if (!setActive) return;
    setActive({ organization: id });
  };

  return (
    <li
      onClick={onClick}
      className="flex items-center p-2 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent"
    >
      <Image
        src={imageUrl}
        alt={name}
        width={20}
        height={20}
        className="mr-2 rounded-sm"
      />
      <span className="text-sm">{name}</span>
      {isActive && <Check className="ml-auto h-3 w-3 opacity-50" />}
    </li>
  );
};
