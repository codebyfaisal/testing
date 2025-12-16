import React from "react";
import Skeleton from "./Skeleton";

const ServiceSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-6"
        >
          <div className="flex flex-col items-center gap-4 text-center h-full">
            {/* Icon Skeleton */}
            <Skeleton className="w-16 h-16 rounded-xl" />

            {/* Title Skeleton */}
            <Skeleton className="h-6 w-3/4 mt-2" />

            {/* Description Skeleton */}
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>

            {/* Buttons Skeleton */}
            <div className="flex justify-center gap-2 bg-zinc-800 w-full p-2 mt-auto rounded-lg">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ServiceSkeleton;
