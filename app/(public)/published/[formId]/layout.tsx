import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fragmenta",
  description: "View and fill out a published form",
};

export default function PublishedFormLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="[&_.rounded-lg]:border-none [&_.rounded-lg]:shadow-none">
      {children}
    </div>
  );
}
