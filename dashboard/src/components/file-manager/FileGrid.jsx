import React from "react";
import FileItem from "./FileItem";
import { FileSkeleton } from "../../components";

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
        className={`grid grid-cols-2 md:grid-cols-3 ${
          isModal ? "lg:grid-cols-4" : "lg:grid-cols-5"
        } gap-4`}
      >
        <FileSkeleton />
      </div>
    );
  }

  if (!loading && (!files || files.length === 0))
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <p>No files found.</p>
      </div>
    );

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 ${
        isModal ? "lg:grid-cols-4" : "lg:grid-cols-5"
      } gap-4`}
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
