"use client";

import { Info } from "./info";

interface CanvasProps {
  formId: string;
}

export const Canvas = ({ formId }: CanvasProps) => {
  return (
    <main className="h-full w-full relative bg-mute touch-none">
      <Info formId={formId} />
    </main>
  );
};
