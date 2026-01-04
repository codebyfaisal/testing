import React from "react";
import { Skeleton, Card } from "@/components";

const BlogSkeleton = () => {
  return (
    <Card className="overflow-hidden space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 bg-muted/20 p-4 rounded-lg"
        >
          <Skeleton className="h-16 w-24 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}
    </Card>
  );
};

export default BlogSkeleton;
