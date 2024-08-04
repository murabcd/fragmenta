import { Header } from "./_components/header";
import { Footer } from "./_components/footer";

import { GridPattern } from "@/components/grid-pattern";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <GridPattern />
      <Header />
      <main className="flex-grow relative z-10">
        <div className="py-24 md:py-32">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
