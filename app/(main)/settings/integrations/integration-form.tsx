"use client";

import { useState } from "react";

import { toast } from "sonner";

import { LoaderCircle } from "lucide-react";
import { Icons } from "@/components/icons";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface IntegrationFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export const IntegrationForm = ({ className, ...props }: IntegrationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Icons.googlesheets className="h-10 w-10" />
        <div>
          <CardTitle className="text-lg font-medium">Google Sheets</CardTitle>
          <CardDescription>
            Send your data straight to Google Sheets and sync all results as they come in.
          </CardDescription>
        </div>
      </CardHeader>
      <CardFooter className="border-t px-6 py-2 bg-muted/50 justify-end">
        {!isConnected ? (
          <Button disabled={isLoading}>
            {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Connect
          </Button>
        ) : (
          <Button variant="destructive" onClick={handleDisconnect} disabled={isLoading}>
            {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Disconnect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
