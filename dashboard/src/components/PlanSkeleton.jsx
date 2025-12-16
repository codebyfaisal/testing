import React from "react";
import Skeleton from "./Skeleton";

const PlanSkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-full"
        >
          {/* Header Section */}
          <div className="p-6 border-b border-zinc-800 space-y-2">
            <Skeleton className="h-6 w-1/2" /> {/* Name */}
            <Skeleton className="h-8 w-1/3" /> {/* Price */}
          </div>

          {/* Body Section */}
          <div className="p-6 bg-zinc-950/50 grow space-y-4">
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
            <div className="pt-4 border-t border-zinc-800 mt-6">
              <Skeleton className="h-4 w-1/4 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-evenly gap-2 p-4 bg-zinc-900 border-t border-zinc-800">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      ))}
    </>
  );
};

export default PlanSkeleton;
