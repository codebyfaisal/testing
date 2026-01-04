import React from "react";
import { Skeleton, Card } from "@/components";

const FileSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <Card key={i} className=" overflow-hidden" padding="p-0">
          {/* Image/Icon Area */}
          <div className="aspect-square w-full bg-muted/30 p-2">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>

          {/* Footer Info */}
          <Card className="border-t space-y-2" padding="p-2" rounded="rounded-0">
            <Skeleton className="h-4! w-3/4" />
            <div className="flex justify-between items-center gap-2">
              <Skeleton className="h-4! w-8" />
              <Skeleton className="h-4! w-12" />
            </div>
          </Card>
        </Card>
      ))}
    </>
  );
};

export default FileSkeleton;
