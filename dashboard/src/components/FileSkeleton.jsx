import React from "react";
import Skeleton from "./Skeleton";

const FileSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div
          key={i}
          className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
        >
          {/* Image/Icon Area */}
          <div className="aspect-square w-full bg-zinc-950 p-8">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>

          {/* Footer Info */}
          <div className="p-3 border-t border-zinc-800 bg-zinc-900 space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-2 w-8" />
              <Skeleton className="h-2 w-12" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FileSkeleton;
