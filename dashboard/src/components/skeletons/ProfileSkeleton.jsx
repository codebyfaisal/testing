import React from "react";
import { Card } from "@/components";

const ProfileSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="h-8 w-48 bg-muted rounded" />

      {/* Profile Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Personal Details */}
        <Card className="lg:col-span-3 space-y-4">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded col-span-2" />
            <div className="h-24 bg-muted rounded col-span-2" />
          </div>
        </Card>

        {/* Media */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="h-6 w-24 bg-muted rounded" />
          <div className="h-48 bg-muted rounded-xl" />
        </Card>
      </div>

      {/* Experience & Education */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-64" />
        <Card className="h-64" />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
