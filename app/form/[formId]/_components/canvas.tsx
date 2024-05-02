"use client";

import { Info } from "./info";
import { Editor } from "./editor";
import { Content } from "./content";
import { Settings } from "./settings";

interface CanvasProps {
  formId: string;
}

export const Canvas = ({ formId }: CanvasProps) => {
  return (
    <main className="h-full w-full relative bg-mute touch-none">
      <Info formId={formId} />
      <div className="flex h-full">
        <Editor />
        <Content />
        <Settings />
      </div>
    </main>
  );
};
