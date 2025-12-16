import React, { useState, use, useMemo, Suspense } from "react";
import useDashboardStore from "../store/useDashboardStore";
import FileManager from "./FileManager";
import { motion } from "motion/react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaQuoteLeft,
  FaCommentDots,
  FaSave,
} from "react-icons/fa";
import {
  Modal,
  Input,
  Textarea,
  Button,
  NotFound,
  ConfirmationModal,
  TestimonialSkeleton,
} from "../components";
import toast from "react-hot-toast";

const TestimonialList = ({ onEdit, onDelete }) => {
  const { fetchTestimonials } = useDashboardStore();
  const testimonials = use(fetchTestimonials());

  if (!testimonials || testimonials.length === 0) {
    return (
      <NotFound
        Icon={FaCommentDots}
        message="No testimonials found."
        className="col-span-full"
      />
    );
  }

  return (
    <>
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-zinc-900 border border-zinc-800 p-6 max-w-md mx-auto rounded-xl relative flex flex-col"
        >
          <FaQuoteLeft className="absolute top-6 right-6 text-zinc-800 text-4xl" />

          <div className="flex items-center gap-4 mb-4 relative z-10">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-zinc-800"
            />
            <div>
              <h3 className="font-bold text-white">{testimonial.name}</h3>
              <p className="text-xs text-indigo-400">{testimonial.role}</p>
            </div>
          </div>

          <p className="text-zinc-400 text-sm mb-6 relative z-10 leading-relaxed grow">
            "{testimonial.text}"
          </p>

          {(testimonial.hasVideo || testimonial.video) && (
            <div className="mb-4 relative z-10 w-full rounded-lg overflow-hidden border border-zinc-800 bg-black">
              {testimonial.videoType === "video" ? (
                <video
                  src={testimonial.videoUrl || testimonial.video}
                  controls
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <iframe
                  src={testimonial.videoUrl || testimonial.video}
                  title="Testimonial Video"
                  className="w-full aspect-video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800 mt-auto">
            <Button
              onClick={() => onEdit(testimonial)}
              uiType="text"
              icon={<FaEdit />}
              label="Edit"
            />
            <Button
              onClick={() => onDelete(testimonial._id)}
              uiType="text"
              icon={<FaTrash />}
              label="Delete"
            />
          </div>
        </motion.div>
      ))}
    </>
  );
};

const Testimonials = () => {
  const { addTestimonial, updateTestimonial, deleteTestimonial } =
    useDashboardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const initialFormState = {
    name: "",
    role: "",
    text: "",
    avatar: "",
    hasVideo: false,
    videoType: "iframe",
    videoUrl: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [initialData, setInitialData] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    type: null,
    id: null,
  });

  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const [fileManagerTarget, setFileManagerTarget] = useState("avatar"); // 'avatar' or 'video'

  const openFileManager = (target) => {
    setFileManagerTarget(target);
    setIsFileManagerOpen(true);
  };

  const handleFileSelect = (file) => {
    if (fileManagerTarget === "avatar") {
      setFormData({ ...formData, avatar: file.url });
    } else if (fileManagerTarget === "video") {
      setFormData({ ...formData, videoUrl: file.url });
    }
    setIsFileManagerOpen(false);
  };

  const handleOpenModal = (testimonial = null) => {
    let initial;
    if (testimonial) {
      setEditingTestimonial(testimonial);
      initial = {
        name: testimonial.name || "",
        role: testimonial.role || "",
        text: testimonial.text || "",
        avatar: testimonial.avatar || "",
        hasVideo: testimonial.hasVideo || !!testimonial.video,
        videoType: testimonial.videoType || "iframe",
        videoUrl: testimonial.videoUrl || testimonial.video || "",
      };
      setFormData(initial);
    } else {
      setEditingTestimonial(null);
      initial = initialFormState;
      setFormData(initial);
    }
    setInitialData(initial);
    setIsModalOpen(true);
  };

  const isModalDirty = useMemo(() => {
    if (!initialData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData, initialData]);

  const handleCloseModal = (force) => {
    const isForce = force === true;
    if (!isForce && isModalDirty) {
      setConfirmState({
        isOpen: true,
        type: "discard",
        id: null,
      });
      return;
    }
    setIsModalOpen(false);
    setEditingTestimonial(null);
    setInitialData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isModalDirty) return;

    setIsSubmitting(true);
    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial._id, formData);
        toast.success("Testimonial updated successfully!");
      } else {
        await addTestimonial(formData);
        toast.success("Testimonial created successfully!");
      }

      handleCloseModal(true);
    } catch (error) {
      console.error("Failed to save testimonial:", error);
      toast.error(error.message || "Failed to save testimonial.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmState({
      isOpen: true,
      type: "delete",
      id: id,
    });
  };

  const handleConfirmAction = async () => {
    try {
      if (confirmState.type === "delete") {
        await deleteTestimonial(confirmState.id);
        toast.success("Testimonial deleted successfully!");
      } else if (confirmState.type === "discard") {
        handleCloseModal(true);
      }
    } catch (error) {
      console.error(`Failed to ${confirmState.type} testimonial:`, error);
      toast.error(
        error.message || `Failed to ${confirmState.type} testimonial.`
      );
    } finally {
      setConfirmState({ isOpen: false, type: null, id: null });
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-zinc-400">Manage client reviews and feedback.</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          uiType="primary"
          icon={<FaPlus />}
          label="Add Testimonial"
        />
      </header>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <Suspense fallback={<TestimonialSkeleton />}>
          <TestimonialList onEdit={handleOpenModal} onDelete={handleDelete} />
        </Suspense>
      </div>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Client Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              label="Role / Company"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              required
            />
          </div>

          <Textarea
            label="Testimonial Text"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            rows={4}
            required
          />

          <div className="flex gap-2 items-end">
            <Input
              label="Avatar URL"
              value={formData.avatar}
              onChange={(e) =>
                setFormData({ ...formData, avatar: e.target.value })
              }
              placeholder="https://..."
              className="flex-1"
            />
            <Button
              onClick={() => openFileManager("avatar")}
              uiType="secondary"
              label="Select Image"
              type="button"
              className="mb-px"
            />
          </div>

          <div className="space-y-4 border-t border-zinc-800 pt-4">
            <div className="flex items-center gap-2">
              <Input
                type="checkbox"
                id="hasVideo"
                checked={formData.hasVideo}
                onChange={(e) =>
                  setFormData({ ...formData, hasVideo: e.target.checked })
                }
              />
              <label htmlFor="hasVideo">Include Video Testimonial</label>
            </div>

            {formData.hasVideo && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <label>Video Source Type</label>
                  <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                    <Button
                      onClick={() =>
                        setFormData({ ...formData, videoType: "iframe" })
                      }
                      uiType={
                        formData.videoType === "iframe" ? "secondary" : "text"
                      }
                      label="Embed"
                      type="button"
                    />
                    <Button
                      onClick={() =>
                        setFormData({ ...formData, videoType: "video" })
                      }
                      uiType={
                        formData.videoType === "video" ? "secondary" : "text"
                      }
                      label="Direct Link"
                      type="button"
                    />
                    <Button
                      onClick={() =>
                        setFormData({ ...formData, videoType: "file" })
                      }
                      uiType={
                        formData.videoType === "file" ? "secondary" : "text"
                      }
                      label="File Manager"
                      type="button"
                    />
                  </div>
                </div>

                {formData.videoType === "file" ? (
                  <div className="flex gap-2 items-end">
                    <Input
                      label="Selected Video URL"
                      value={formData.videoUrl}
                      readOnly
                      placeholder="Select a video file..."
                      className="flex-1"
                    />
                    <Button
                      onClick={() => openFileManager("video")}
                      uiType="secondary"
                      label="Select Video"
                      type="button"
                      className="mb-px"
                    />
                  </div>
                ) : (
                  <Input
                    label={
                      formData.videoType === "iframe"
                        ? "Embed URL (src)"
                        : "Video File URL"
                    }
                    value={formData.videoUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, videoUrl: e.target.value })
                    }
                    placeholder={
                      formData.videoType === "iframe"
                        ? "https://www.youtube.com/embed/..."
                        : "https://example.com/video.mp4"
                    }
                  />
                )}
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 pb-2">
            <Button
              onClick={handleCloseModal}
              uiType="text"
              label="Cancel"
              type="button"
            />
            <Button
              onClick={handleSubmit}
              uiType="primary"
              type="submit"
              disabled={isSubmitting || !isModalDirty}
              loading={isSubmitting}
              icon={<FaSave />}
              className={`bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-auto ${
                !isModalDirty && !isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              label={
                isSubmitting
                  ? "Saving..."
                  : editingTestimonial
                  ? "Update"
                  : "Create"
              }
            />
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, type: null, id: null })}
        onConfirm={handleConfirmAction}
        title={
          confirmState.type === "delete"
            ? "Delete Testimonial?"
            : "Discard Changes?"
        }
        message={
          confirmState.type === "delete"
            ? "Are you sure you want to delete this testimonial? This action cannot be undone."
            : "You have unsaved changes. Are you sure you want to discard them?"
        }
        confirmText={confirmState.type === "delete" ? "Delete" : "Discard"}
        isDangerous={true}
      />

      {/* File Manager Modal */}
      <Modal
        isOpen={isFileManagerOpen}
        onClose={() => setIsFileManagerOpen(false)}
        title={
          fileManagerTarget === "avatar" ? "Select Avatar" : "Select Video"
        }
      >
        <div className="h-[70vh] overflow-y-auto">
          <FileManager
            isModal={true}
            resType={fileManagerTarget === "avatar" ? "images" : "videos"}
            onSelect={handleFileSelect}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Testimonials;
