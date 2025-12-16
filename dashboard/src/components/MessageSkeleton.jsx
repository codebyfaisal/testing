import React from "react";
import Skeleton from "./Skeleton";

const MessageSkeleton = () => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Table Header Wrapper to match visual style */}
      <div className="border-b border-zinc-800 bg-zinc-950 p-4 flex gap-4">
        <Skeleton className="h-4 w-full" />
      </div>

      <div className="p-4 space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex gap-4 items-center">
            <Skeleton className="h-8 w-16 rounded-full" /> {/* Status */}
            <Skeleton className="h-6 w-20 rounded-full" /> {/* Type */}
            <Skeleton className="h-4 w-32" /> {/* From */}
            <Skeleton className="h-4 flex-1" /> {/* Subject */}
            <Skeleton className="h-4 w-24" /> {/* Date */}
            <Skeleton className="h-8 w-20" /> {/* Actions */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageSkeleton;
