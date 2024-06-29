import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { Footer } from "./_components/footer";

const MarketingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full">
        <Header />
      </div>
      <main className="flex-grow flex items-center justify-center">
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default MarketingPage;
