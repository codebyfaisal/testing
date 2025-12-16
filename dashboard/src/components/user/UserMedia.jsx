import React, { useState } from "react";
import { motion } from "motion/react";
import { ImagePicker, Button, FilePickerModal } from "../../components";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

const UserMedia = ({ formData, setFormData, className }) => {
  const [pickerState, setPickerState] = useState({
    isOpen: false,
    type: "images",
    target: null,
  });

  const handleOpenPicker = (type, target) =>
    setPickerState({ isOpen: true, type, target });

  const handleSelect = (url) => {
    if (pickerState.target === "resume") {
      setFormData((prev) => ({ ...prev, resume: url }));
      toast.success("Resume selected! Remember to save changes.");
    } else if (pickerState.target === "introVideo") {
      setFormData((prev) => ({ ...prev, introVideo: url }));
      toast.success("Video selected! Remember to save changes.");
    }
  };

  const handleRemove = (target) => {
    if (confirm(`Remove ${target}?`)) {
      if (target === "resume") setFormData((prev) => ({ ...prev, resume: "" }));
      else if (target === "introVideo")
        setFormData((prev) => ({ ...prev, introVideo: "" }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-zinc-950 border border-zinc-800 rounded-2xl p-6 ${className}`}
    >
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <FaCamera className="text-indigo-500" /> Media & Attachments
      </h3>

      <div className="mb-6 w-32 h-32">
        <ImagePicker
          value={formData.avatar}
          onChange={(url) => setFormData((prev) => ({ ...prev, avatar: url }))}
          className="w-full h-full"
          imageClassName="rounded-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Resume */}
        <div className="space-y-4">
          <h4 className="font-medium text-white">Resume (PDF)</h4>
          {formData.resume ? (
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-red-500/20 p-2 rounded-lg text-red-500">
                  <FaBriefcase size={18} />
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-white truncate">
                    {formData.resume.split("/").pop()}
                  </p>
                  <a
                    href={formData.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    View File
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemove("resume")}
                className="text-zinc-500 hover:text-red-500 p-2"
              >
                <FaTrash />
              </button>
            </div>
          ) : (
            <div className="border border-dashed border-zinc-700 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-indigo-500 transition-colors bg-zinc-950/50">
              <p className="text-sm text-zinc-400 mb-3">
                Select your resume (PDF)
              </p>
              <Button
                onClick={() => handleOpenPicker("raw", "resume")}
                label="Select PDF"
                uiType="primary"
                icon={<FaFilePdf />}
                size="sm"
              />
            </div>
          )}
        </div>

        {/* Intro Video */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-white">Intro Video</h4>
            {formData.introVideo && (
              <button
                type="button"
                onClick={() => handleRemove("introVideo")}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            )}
          </div>

          {!formData.introVideo ? (
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-4 flex flex-col items-center justify-center min-h-[150px]">
              <p className="text-sm text-zinc-400 mb-3">
                Select a video from File Manager
              </p>
              <Button
                onClick={() => handleOpenPicker("video", "introVideo")}
                label="Select Video"
                uiType="secondary"
                icon={<FaVideo />}
              />
            </div>
          ) : (
            <div className="relative aspect-video bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
              {formData.introVideo.includes("cloudinary") ? (
                <video
                  src={formData.introVideo}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                  <FaYoutube size={32} className="text-red-500 mb-2" />
                  <a
                    href={formData.introVideo}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-300 hover:text-white underline text-sm break-all"
                  >
                    Watch Video
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <FilePickerModal
        isOpen={pickerState.isOpen}
        onClose={() => setPickerState((prev) => ({ ...prev, isOpen: false }))}
        onSelect={handleSelect}
        resourceType={pickerState.type}
      />
    </motion.div>
  );
};

export default UserMedia;
