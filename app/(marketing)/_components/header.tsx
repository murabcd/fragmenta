import SidebarLogo from "@/components/sidebar-logo";
import { ModeToggle } from "@/components/theme-toggle-mode";

export const Header = () => {
  return (
    <div className="flex items-center justify-between w-full px-4 py-2">
      <SidebarLogo />
      <ModeToggle />
    </div>
  );
};
