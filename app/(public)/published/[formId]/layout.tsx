import React from "react";

export default function PublishedFormLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="[&_.rounded-lg]:border-none [&_.rounded-lg]:shadow-none">
      {children}
    </div>
  );
}
