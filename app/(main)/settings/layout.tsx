"use client";

import { useOrganization } from "@/hooks/use-organization";

import { SidebarSettings } from "./sidebar-settings";

import { Loader } from "lucide-react";

const sidebar = [
  {
    title: "Profile",
    href: "/settings/profile",
  },
  {
    title: "Organization",
    href: "/settings/organization",
  },
  {
    title: "Members",
    href: "/settings/members",
  },
  {
    title: "Integrations",
    href: "/settings/integrations",
  },
  {
    title: "Billing",
    href: "/settings/billing",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const { isLoading } = useOrganization();

  return (
    <section className="space-y-6 p-6 relative min-h-screen">
      <div className="w-full">
        <SidebarSettings items={sidebar} />
      </div>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader className="h-6 w-6 text-muted-foreground animate-spin duration-700" />
        </div>
      ) : (
        <div className="flex-1 max-w-3xl">{children}</div>
      )}
    </section>
  );
}
