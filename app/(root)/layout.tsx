import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { SearchCommand } from "@/components/search-command";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className=" flex-1 hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col md:border-r md:shadow-sm">
        <Sidebar />
      </div>
      <main className="md:pl-64 h-full">
        <Navbar />
        <SearchCommand />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
