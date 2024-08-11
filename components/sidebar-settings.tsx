"use client";

import { useState } from "react";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";

import { Building, User, Users, CreditCard, Link } from "lucide-react";

import { OrganizationSettings } from "@/components/settings/org-settings";
import { ProfileSettings } from "@/components/settings/profile-settings";

const routes = [
  { label: "Organization", icon: Building },
  { label: "Profile", icon: User },
  { label: "Members", icon: Users },
  { label: "Billing", icon: CreditCard },
  { label: "Integrations", icon: Link },
];

export const SidebarSettings = () => {
  const [activeTab, setActiveTab] = useState("Organization");

  const renderContent = () => {
    switch (activeTab) {
      case "Organization":
        return <OrganizationSettings />;
      case "Profile":
        return <ProfileSettings />;
      // Add other cases for different tabs
      default:
        return <p>Content for {activeTab} goes here.</p>;
    }
  };

  return (
    <DialogContent className="sm:max-w-[900px] h-[80vh] flex flex-row p-0 gap-0">
      <div className="w-64 rounded-tl-md rounded-bl-md border-r h-full bg-background">
        <DialogHeader className="p-6">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your settings.</DialogDescription>
        </DialogHeader>
        <nav className="grid items-start px-2 text-sm text-muted-foreground">
          {routes.map((route) => (
            <div
              key={route.label}
              onClick={() => setActiveTab(route.label)}
              className={cn(
                "text-sm group flex p-3 w-full justify-start cursor-pointer hover:text-foreground rounded-lg transition",
                {
                  "bg-primary/10 text-foreground": activeTab === route.label,
                }
              )}
            >
              <div className="flex items-center justify-center">
                <route.icon className="mr-2 h-5 w-5" />
                {route.label}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <div className="flex-1 p-6 overflow-y-auto bg-muted/40">{renderContent()}</div>
    </DialogContent>
  );
};
