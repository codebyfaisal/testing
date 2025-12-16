import React from "react";
import Skeleton from "./Skeleton";

const TestimonialSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col h-64"
        >
          {/* Header: Avatar + Info */}
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex flex-col gap-2 w-1/2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>

          {/* Text Body */}
          <div className="space-y-2 mb-6 grow">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800 mt-auto">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </>
  );
};

export default TestimonialSkeleton;
