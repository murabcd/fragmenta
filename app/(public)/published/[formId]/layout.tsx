import React from "react";

export default function PublishedFormLayout({ children }: { children: React.ReactNode }) {
  return <div className="[&_*]:border-none [&_*]:shadow-none">{children}</div>;
}
