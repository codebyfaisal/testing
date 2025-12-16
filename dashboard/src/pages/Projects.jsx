import React, { useState, use, Suspense, useEffect, useMemo } from "react";
import useDashboardStore from "../store/useDashboardStore";
import FileManager from "./FileManager";
import { motion } from "motion/react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaGithub,
  FaExternalLinkAlt,
  FaProjectDiagram,
} from "react-icons/fa";
import {
  Modal,
  Input,
  Textarea,
  Button,
  NotFound,
  ConfirmationModal,
  ProjectSkeleton,
} from "../components";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const ProjectList = ({ onEdit, onDelete }) => {
  const { fetchProjects } = useDashboardStore();
  const projects = use(fetchProjects());

  if (!projects || projects.length === 0) {
    return (
      <NotFound
        Icon={FaProjectDiagram}
        message="No projects found."
        className="col-span-full"
      />
    );
  }

  return (
    <>
      {projects.map((project, index) => (
        <motion.div
          key={project._id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group max-w-md mx-auto"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={
                project.images && project.images.length > 0
                  ? project.images[0]
                  : ""
              }
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <Button
                onClick={() => onEdit(project)}
                uiType="text"
                icon={<FaEdit size={12} />}
                label="Edit"
              />
              <Button
                onClick={() => onDelete(project._id)}
                uiType="danger"
                icon={<FaTrash size={12} />}
                label="Delete"
              />
            </div>
            {project.featured && (
              <div className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full border border-yellow-500/20 backdrop-blur-md">
                FEATURED
              </div>
            )}
          </div>

          <div className="p-5">
            <h3 className="text-lg font-bold text-white mb-2">
              {project.title}
            </h3>
            <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {(project.techStack || []).map((tech, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
              >
                <FaGithub /> Code
              </a>
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
              >
                <FaExternalLinkAlt /> Live Demo
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

const Projects = () => {
  const [searchParams] = useSearchParams();
  const { addProject, updateProject, deleteProject } = useDashboardStore();

  useEffect(() => {
    if (searchParams.get("new")) setIsModalOpen(true);
  }, [searchParams]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [],
    date: {
      start: "",
      end: "",
      ongoing: false,
    },
    rawFile: null,
    techStack: "",
    githubLink: "",
    liveLink: "",
    features: "",
    featured: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    type: null,
    id: null,
  });

  const [initialFormData, setInitialFormData] = useState(null);

  const handleOpenModal = (project = null) => {
    let initialData;
    if (project) {
      setEditingProject(project);
      initialData = {
        title: project.title || "",
        description: project.description || "",
        images: Array.isArray(project.images)
          ? project.images
          : project.images
          ? [project.images]
          : [],
        date: {
          start: project.date?.start ? project.date.start.split("T")[0] : "",
          end: project.date?.end ? project.date.end.split("T")[0] : "",
          ongoing: project.date?.ongoing || false,
        },
        rawFile: null,
        techStack: project.techStack?.join(", ") || "",
        githubLink: project.githubLink || "",
        liveLink: project.liveLink || "",
        features: project?.features?.join(", ") || "",
        featured: project.featured || false,
      };
      setFormData(initialData);
    } else {
      setEditingProject(null);
      initialData = {
        title: "",
        description: "",
        images: [],
        date: {
          start: "",
          end: "",
          ongoing: false,
        },
        rawFile: null,
        techStack: "",
        githubLink: "",
        liveLink: "",
        features: "",
        featured: false,
      };
      setFormData(initialData);
    }
    setInitialFormData(initialData);
    setIsModalOpen(true);
  };

  const isModalDirty = useMemo(() => {
    if (!initialFormData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData]);

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
    setEditingProject(null);
    setInitialFormData(null);
  };

  const handleFileSelect = (file) => {
    if (!formData.images.includes(file.url)) {
      setFormData({ ...formData, images: [...formData.images, file.url] });
    }
    setIsFileManagerOpen(false);
  };

  const removeImage = (indexToRemove) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, index) => index !== indexToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isModalDirty) return;
    setIsSubmitting(true);
    const projectData = {
      ...formData,
      techStack: formData.techStack
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      features: formData.features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f),
    };

    console.log(projectData);

    try {
      if (editingProject) {
        await updateProject(editingProject._id, projectData);
        toast.success("Project updated successfully!");
      } else {
        await addProject(projectData);
        toast.success("Project created successfully!");
      }
      handleCloseModal(true);
    } catch (error) {
      console.error("Failed to save project:", error);
      toast.error(error?.response?.data?.message || "Failed to save project.");
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
    if (confirmState.type === "delete") {
      try {
        await deleteProject(confirmState.id);
        toast.success("Project deleted successfully!");
      } catch (error) {
        console.error("Failed to delete project:", error);
        toast.error(
          error?.response?.data?.message || "Failed to delete project."
        );
      } finally {
        setConfirmState({ isOpen: false, type: null, id: null });
      }
    } else if (confirmState.type === "discard") {
      setConfirmState({ isOpen: false, type: null, id: null });
      handleCloseModal(true);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-zinc-400">Manage your portfolio projects.</p>
        </div>
        <Button
          onClick={() => handleOpenModal(null)}
          uiType="primary"
          icon={<FaPlus size={12} />}
          label="Add Project"
        />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <Suspense fallback={<ProjectSkeleton />}>
          <ProjectList onEdit={handleOpenModal} onDelete={handleDelete} />
        </Suspense>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? "Edit Project" : "Add New Project"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            <Input
              label="Start Date"
              type="date"
              value={formData.date.start}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date: { ...formData.date, start: e.target.value },
                })
              }
              required
            />
            <div className="flex items-end gap-2">
              {!formData.date.ongoing && (
                <Input
                  label="End Date"
                  type="date"
                  value={formData.date.end}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: { ...formData.date, end: e.target.value },
                    })
                  }
                  required={!formData.date.ongoing}
                  className="flex-1"
                />
              )}
              <div className="flex items-center gap-2 h-10 pb-3">
                <input
                  type="checkbox"
                  id="ongoing"
                  checked={formData.date.ongoing}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: { ...formData.date, ongoing: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="ongoing"
                  className="text-sm font-medium text-zinc-300 whitespace-nowrap"
                >
                  Ongoing
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Project Images
              </label>
              <div className="grid grid-cols-3 gap-2">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-lg overflow-hidden group border border-zinc-800"
                  >
                    <img
                      src={img}
                      alt={`Project ${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setIsFileManagerOpen(true)}
                  className="flex flex-col items-center justify-center aspect-video bg-zinc-900 border border-dashed border-zinc-700 rounded-lg hover:bg-zinc-800 hover:border-indigo-500 transition-colors"
                >
                  <FaPlus className="text-zinc-500 mb-1" />
                  <span className="text-xs text-zinc-400">Add Image</span>
                </button>
              </div>
            </div>
          </div>

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            rows={5}
          />

          <Input
            label="Tech Stack (comma separated)"
            value={formData.techStack}
            onChange={(e) =>
              setFormData({ ...formData, techStack: e.target.value })
            }
            placeholder="React, Node.js, Tailwind"
          />

          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Repository URL"
              value={formData.githubLink}
              onChange={(e) =>
                setFormData({ ...formData, githubLink: e.target.value })
              }
            />
            <Input
              label="Live Demo URL"
              value={formData.liveLink}
              onChange={(e) =>
                setFormData({ ...formData, liveLink: e.target.value })
              }
            />
          </div>
          <Textarea
            label="Key Features (comma separated)"
            value={formData.features}
            onChange={(e) =>
              setFormData({ ...formData, features: e.target.value })
            }
            placeholder="Feature 1, Feature 2, Feature 3"
            rows={4}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="featured"
              className="text-sm font-medium text-zinc-300"
            >
              Featured Project
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              onClick={handleCloseModal}
              uiType="text"
              className="px-4 py-2 text-zinc-400 hover:text-white transition-colors w-auto"
              label="Cancel"
            />
            <Button
              uiType="primary"
              type="submit"
              disabled={isSubmitting || !isModalDirty}
              loading={isSubmitting}
              className={`bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-auto ${
                !isModalDirty && !isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              label={
                isSubmitting
                  ? "Saving..."
                  : editingProject
                  ? "Update Project"
                  : "Create Project"
              }
            />
          </div>
        </form>
      </Modal>

      {/* File Manager Modal */}
      <Modal
        isOpen={isFileManagerOpen}
        onClose={() => setIsFileManagerOpen(false)}
        title="Select Project Image"
      >
        <div className="h-[70vh] overflow-y-auto">
          <FileManager
            isModal={true}
            resType="images"
            onSelect={handleFileSelect}
          />
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, type: null, id: null })}
        onConfirm={handleConfirmAction}
        title={
          confirmState.type === "delete"
            ? "Delete Project?"
            : "Discard Changes?"
        }
        message={
          confirmState.type === "delete"
            ? "Are you sure you want to delete this project? This action cannot be undone."
            : "You have unsaved changes. Are you sure you want to discard them and close?"
        }
        confirmText={confirmState.type === "delete" ? "Delete" : "Discard"}
        isDangerous={true}
      />
    </div>
  );
};

export default Projects;
