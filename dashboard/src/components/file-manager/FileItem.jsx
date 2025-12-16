import React from "react";
import {
  FaCopy,
  FaTrash,
  FaFilePdf,
  FaVideo,
  FaImage,
  FaEye,
  FaPlay,
} from "react-icons/fa";
import toast from "react-hot-toast";

const FileItem = ({ file, onDelete, onClick, onSelect, isModal }) => {
  const isImage = file.resource_type === "image" && file.format !== "pdf";
  const isVideo = file.resource_type === "video";
  const isPdf = file.format === "pdf";

  const handleCopyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(file.secure_url);
    toast.success("Link copied to clipboard!");
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(file.public_id);
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    onClick({ url: file.secure_url, type: file.resource_type });
  };

  return (
    <div
      className={`group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all ${
        onSelect ? "cursor-pointer hover:border-indigo-500" : ""
      }`}
      onClick={() => onSelect && onSelect(file)}
    >
      <div className="aspect-square w-full bg-zinc-950 flex items-center justify-center overflow-hidden">
        {isImage ? (
          <img
            src={file.secure_url}
            alt={file.public_id}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
        ) : isVideo ? (
          <div className="text-zinc-500 flex flex-col items-center">
            <FaVideo size={48} />
            <span className="mt-2 text-xs">Video</span>
          </div>
        ) : isPdf ? (
          <div className="text-red-500 flex flex-col items-center">
            <FaFilePdf size={48} />
            <span className="mt-2 text-xs">PDF</span>
          </div>
        ) : (
          <div className="text-zinc-500 flex flex-col items-center">
            <FaImage size={48} />
            <span className="mt-2 text-xs">File</span>
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {onSelect ? (
            <span className="text-white text-xs font-bold bg-indigo-600 px-3 py-1.5 rounded-lg shadow-lg transform scale-95 group-hover:scale-100 transition-transform">
              Select
            </span>
          ) : (
            <>
              <button
                onClick={handleCopyLink}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
                title="Copy Link"
              >
                <FaCopy />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-500 rounded-full backdrop-blur-sm transition-colors"
                title="Delete"
              >
                <FaTrash />
              </button>
              {(isImage || isVideo) && (
                <button
                  onClick={handlePreview}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
                  title="Preview"
                >
                  {isVideo ? <FaPlay /> : <FaEye />}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-zinc-800 bg-zinc-900">
        <p
          className="text-xs text-zinc-400 truncate font-mono"
          title={file.public_id}
        >
          {file.public_id.split("/").pop()}
        </p>
        <div className="flex justify-between items-center mt-2 text-[10px] text-zinc-500">
          <span className="uppercase">{file.format}</span>
          <span>{(file.bytes / 1024).toFixed(0)} KB</span>
        </div>
      </div>
    </div>
  );
};

export default FileItem;
