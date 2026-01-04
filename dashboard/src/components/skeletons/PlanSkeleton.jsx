import React from "react";
import { Skeleton, Card } from "@/components";

const PlanSkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden flex flex-col h-full">
          {/* Header Section */}
          <div className="p-6 border-b border-border space-y-2">
            <Skeleton className="h-6 w-1/2" /> {/* Name */}
            <Skeleton className="h-8 w-1/3" /> {/* Price */}
          </div>

          {/* Body Section */}
          <div className="p-6 bg-muted/30 grow space-y-4">
            <Skeleton className="h-4 w-1/4 mb-4" /> {/* "Features" label */}
            {/* Feature List */}
            <div className="space-y-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center gap-2">
                  <Skeleton className="w-1.5 h-1.5 rounded-full shrink-0" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
            {/* Add Ons placeholder */}
            <div className="pt-4 border-t border-border mt-6">
              <Skeleton className="h-4 w-1/4 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-evenly gap-2 p-4 bg-muted/10 border-t border-border">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-12" />
          </div>
        </Card>
      ))}
    </>
  );
};

export default PlanSkeleton;
