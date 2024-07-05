"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Zap } from "lucide-react";

export const UpgradePro = () => {
  return (
    <Card className="bg-muted/40">
      <CardHeader>
        <CardTitle className="text-xl">Upgrade to Pro</CardTitle>
        <CardDescription>
          Upgrade to Pro plan to unlock unlimited features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="premium" className="w-full">
          <Zap className="mr-2 h-4 w-4" />
          Upgrade
        </Button>
      </CardContent>
    </Card>
  );
};
