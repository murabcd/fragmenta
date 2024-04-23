"use client";

import { EmptyHomeState } from "./empty-home-state";

interface FormListProps {
  orgId: string;
}

export const FormList = ({ orgId }: FormListProps) => {
  const data = [];

  if (!data?.length) {
    return <EmptyHomeState />;
  }

  return <div>Form List</div>;
};
