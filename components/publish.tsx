"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Check, Copy, Globe, GlobeLock, Send } from "lucide-react";

import { useOrigin } from "@/hooks/use-origin";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover";

import { Hint } from "@/components/hint";

import { useQuery } from "convex/react";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface PublishProps {
  formId: string;
}

export const Publish = ({ formId }: PublishProps) => {
  const data = useQuery(api.form.get, {
    id: formId as Id<"forms">,
  });

  const { mutate, pending } = useApiMutation(api.form.publish);

  const origin = useOrigin();

  const [copied, setCopied] = useState(false);

  const url = `${origin}/published/${formId}`;

  const onPublish = () => {
    const promise = mutate({
      id: formId,
      isPublished: true,
    });

    toast.promise(promise, {
      loading: "Publishing...",
      success: "Form published",
      error: "Failed to publish form",
    });
  };

  const onUnpublish = () => {
    const promise = mutate({
      id: formId,
      isPublished: false,
    });

    toast.promise(promise, {
      loading: "Unpublishing...",
      success: "Form unpublished",
      error: "Failed to unpublish form",
    });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Hint label="Make publicly accessible" side="bottom" sideOffset={10}>
          <Button variant={data?.isPublished ? "outline" : "default"}>
            {data?.isPublished ? "Published" : "Publish"}
          </Button>
        </Hint>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" sideOffset={10} forceMount>
        {data?.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="text-sky-500 animate-pulse h-6 w-6" />
              <p className="text-sm text-balance leading-relaxed">
                This form is live on the web.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Input id="link" value={url} disabled />
              </div>
              <Button onClick={onCopy} disabled={copied} className="px-3">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button className="w-full" disabled={pending} onClick={onUnpublish}>
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <GlobeLock className="h-8 w-8 text-muted-foreground mb-2 text-sky-500" />
            <h3 className="text-lg font-semibold">Publish form</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Share your work with others.
            </p>
            <Button disabled={pending} onClick={onPublish} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
