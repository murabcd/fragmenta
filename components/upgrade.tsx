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
      <CardHeader className="p-2 pt-0 md:p-4">
        <CardTitle>Upgrade to Pro</CardTitle>
        <CardDescription>
          Upgrade to Pro to get an unlimited access to our features.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
        <Button variant="premium" size="sm" className="w-full">
          <Zap className="mr-2 h-4 w-4" />
          Upgrade
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpgradePro;
