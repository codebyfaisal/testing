import React, { useState } from "react";
import { FaImage, FaTimes, FaPen } from "react-icons/fa";
import FilePickerModal from "./FilePickerModal";
import Button from "./Button";

const ImagePicker = ({
  label,
  value,
  onChange,
  className = "",
  imageClassName = "",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-zinc-300">{label}</label>
      )}

      {value ? (
        <div
          className={`relative w-full h-full bg-zinc-950 border border-zinc-800 overflow-hidden group ${
            imageClassName || "h-48 rounded-lg"
          }`}
        >
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              onClick={() => setIsModalOpen(true)}
              icon={<FaPen />}
              uiType="secondary"
              size="sm"
            />
            <Button
              onClick={() => onChange("")}
              icon={<FaTimes />}
              uiType="danger"
              size="sm"
            />
          </div>
        </div>
      ) : (
        <div
          className={`relative w-full bg-zinc-900/30 border border-dashed border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-zinc-900 transition-all ${
            imageClassName || "h-32 rounded-lg"
          }`}
          onClick={() => setIsModalOpen(true)}
        >
          <FaImage className="text-3xl text-zinc-500 mb-2" />
          <p className="text-sm text-zinc-400">Select Image</p>
        </div>
      )}

      <FilePickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(url) => onChange(url)}
        resourceType="images"
      />
    </div>
  );
};

export default ImagePicker;
