import React from "react";
import { Card, Skeleton } from "@/components";

const SubscriberSkeleton = () => {
  return (
    <Card className="overflow-x-auto">
      <div className="p-4 border-b border-border flex gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-4 w-24 hidden md:block" />
        ))}
      </div>
      <div className="divide-y divide-border">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1 w-full max-w-xs">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-5 w-24 hidden md:block" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SubscriberSkeleton;
