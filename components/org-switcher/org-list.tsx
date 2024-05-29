"use client";

import { useOrganizationList } from "@clerk/nextjs";

import { OrgItem } from "./org-item";

export const OrgList = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  if (!userMemberships.data?.length) return null;

  return (
    <ul>
      {userMemberships.data?.map((mem) => (
        <OrgItem
          key={mem.organization.id}
          id={mem.organization.id}
          name={mem.organization.name}
          imageUrl={mem.organization.imageUrl}
        />
      ))}
    </ul>
  );
};
