import React from "react";
import { Skeleton, Card } from "@/components";

const MessageSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      {/* Table Header Wrapper to match visual style */}
      <div className="border-b border-border bg-muted/30 p-4 flex gap-4">
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
    </Card>
  );
};

export default MessageSkeleton;
