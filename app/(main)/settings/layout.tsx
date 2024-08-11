import { SidebarSettings } from "./sidebar-settings";

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

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <section className="space-y-6 p-6">
      <div className="w-full">
        <SidebarSettings items={sidebar} />
      </div>
      <div className="flex-1 max-w-3xl">{children}</div>
    </section>
  );
}
