import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { SearchCommand } from "@/components/search-command";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-muted/40">
      <main className="h-full">
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          <Sidebar />
        </div>
        <div className="md:pl-64 min-h-screen">
          <Navbar />
          <SearchCommand />
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
