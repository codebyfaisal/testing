import React from "react";
import Skeleton from "./Skeleton";

const StatsSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-2"
          >
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSkeleton;
