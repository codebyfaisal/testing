import React, { useEffect, useState } from "react";
import useDashboardStore from "@/store/useDashboardStore";
import { FaCloudUploadAlt, FaSync } from "react-icons/fa";
import { Button, Modal, FileGrid, PageHeader } from "@/components";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/utils/cn";

const UploadBtn = ({ loading, uploading, handleFileUpload, loadMedia }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative overflow-hidden">
        <Button
          label={uploading ? "Uploading..." : "Upload File"}
          icon={<FaCloudUploadAlt />}
          uiType="primary"
          disabled={uploading}
        />
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileUpload}
          disabled={uploading}
        />
      </div>
      <Button
        onClick={() => loadMedia(true)}
        icon={<FaSync className={loading ? "animate-spin" : ""} />}
        uiType="secondary"
        disabled={loading}
      />
    </div>
  );
};

const FileManager = ({ isModal = false, resType = "all", onSelect }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { fetchFiles, deleteFile, uploadFile } = useDashboardStore();
  const [files, setFiles] = useState([]);
  const [resourceType, setResourceType] = useState(
    searchParams.get("resourceType") || resType
  );
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [preview, setPreview] = useState({ url: null, type: null });

  const loadMedia = async (reset = false, cursor = null) => {
    if (!isModal) {
      searchParams.set("resourceType", resourceType);
      setSearchParams(searchParams);
    }
    setLoading(true);
    try {
      const data = await fetchFiles(resourceType, cursor);
      if (reset) setFiles(data.resources);
      else setFiles((prev) => [...prev, ...data.resources]);
      setNextCursor(data.next_cursor);
    } catch (error) {
      toast.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFiles([]);
    setNextCursor(null);
    loadMedia(true);
  }, [resourceType]);

  const handleDelete = async (publicId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this file? This cannot be undone."
      )
    )
      return;

    try {
      await deleteFile(publicId);
      setFiles((prev) => prev.filter((f) => f.public_id !== publicId));
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(error?.response?.data?.message || "Failed to delete file");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const newMedia = await uploadFile(file);
      toast.success("File uploaded successfully");
      loadMedia(true);
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const handlePreview = ({ url, type }) => {
    setOpenModal(true);
    setPreview({ url, type });
  };

  return (
    <div
      className={cn(
        isModal ? "space-y-4" : "h-[calc(100vh-2rem)] flex flex-col space-y-4"
      )}
    >
      <header className={cn(isModal && "mb-0")}>
        <div className={isModal ? "hidden" : ""}>
          <PageHeader
            title="File Manager"
            description="Manage your cloud assets (images, videos, PDFs)."
          >
            {!isModal && (
              <UploadBtn
                loading={loading}
                uploading={uploading}
                handleFileUpload={handleFileUpload}
                loadMedia={loadMedia}
              />
            )}
          </PageHeader>
        </div>
      </header>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex gap-2 overflow-x-auto",
            !isModal && "border-b border-border pb-2"
          )}
        >
          {["all", "images", "videos", "PDF", "others"].map((type, index) =>
            isModal && type === "others" ? null : (
              <button
                type="button"
                key={index}
                onClick={() => {
                  if (!isModal) {
                    searchParams.set("resourceType", type);
                    setSearchParams(searchParams);
                  }
                  setResourceType(type);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize
                ${
                  resourceType === type
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {type}
              </button>
            )
          )}
        </div>

        {isModal && (
          <UploadBtn
            loading={loading}
            uploading={uploading}
            handleFileUpload={handleFileUpload}
            loadMedia={loadMedia}
          />
        )}
      </div>

      {/* Content */}
      <div className={isModal ? "" : "flex-1 overflow-y-auto min-h-0 pr-1"}>
        <FileGrid
          files={files}
          onDelete={handleDelete}
          onPreview={handlePreview}
          onSelect={onSelect}
          isModal={isModal}
          loading={loading && !nextCursor}
          emptyMessage={
            resourceType === "all"
              ? "No files uploaded yet."
              : `No ${resourceType} files found.`
          }
        />

        {/* Load More */}
        {nextCursor && (
          <div className="flex justify-center pt-8 pb-4">
            <Button
              label="Load More"
              onClick={() => loadMedia(false, nextCursor)}
              uiType="secondary"
              disabled={loading}
            />
          </div>
        )}
      </div>

      <Modal
        title="Preview Video"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      >
        {preview.type === "video" ? (
          <video
            src={preview.url}
            controls
            className="w-full h-[60vh] object-contain"
          ></video>
        ) : (
          <img
            src={preview.url}
            alt=""
            className="w-full h-[60vh] object-contain"
          />
        )}
      </Modal>
    </div>
  );
};

export default FileManager;
