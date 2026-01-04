import React from "react";
import {Skeleton, Card} from "@/components";

const ApplicationSkeleton = () => {
  return (
    <Card className="overflow-x-auto">
      <div className="p-4 border-b border-border flex gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-4 w-24 hidden md:block" />
        ))}
      </div>
      <div className="divide-y divide-border">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-5 w-1/4 hidden md:block" />
            <Skeleton className="h-5 w-24 rounded-full hidden lg:block" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ApplicationSkeleton;
