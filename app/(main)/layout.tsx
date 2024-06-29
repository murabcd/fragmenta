import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { SearchCommand } from "@/components/search-command";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full bg-muted/40">
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div>
      <div className="md:pl-64 h-full">
        <Navbar />
        <SearchCommand />
        {children}
      </div>
    </main>
  );
};

export default DashboardLayout;
