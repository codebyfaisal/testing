import React from "react";
import { Card } from "@/components";

const ConfigurationSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded" />

      {/* Appearance */}
      <Card className="space-y-6">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="h-16 bg-muted rounded-xl" />
        <div className="h-16 bg-muted rounded-xl" />
      </Card>

      {/* Hero & About */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-96" />
        <Card className="h-96" />
      </div>
    </div>
  );
};

export default ConfigurationSkeleton;
