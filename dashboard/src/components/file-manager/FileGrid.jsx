import React from "react";
import { FileItem, FileSkeleton } from "@/components";
import { cn } from "@/utils/cn";

const FileGrid = ({
  files,
  onDelete,
  onPreview,
  onSelect,
  isModal,
  loading,
}) => {
  if (loading) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 md:grid-cols-3",
          isModal ? "lg:grid-cols-4" : "lg:grid-cols-5"
        )}
      >
        <FileSkeleton />
      </div>
    );
  }

  if (!loading && (!files || files.length === 0))
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p>No files found.</p>
      </div>
    );

  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 gap-4",
        isModal ? "lg:grid-cols-4" : "lg:grid-cols-5"
      )}
    >
      {files.map((file) => (
        <FileItem
          key={file.public_id}
          file={file}
          onDelete={onDelete}
          onClick={onPreview}
          onSelect={onSelect}
          isModal
        />
      ))}
    </div>
  );
};

export default FileGrid;
