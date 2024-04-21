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

const UpgradePro = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrade to Pro</CardTitle>
        <CardDescription>
          Upgrade to our Pro plan to gain unlimited access to all our features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="premium" size="sm" className="w-full">
          <Zap className="mr-2 h-4 w-4" />
          Upgrade
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpgradePro;
