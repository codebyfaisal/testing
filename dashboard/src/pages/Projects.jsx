import React, { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useDashboardStore from "@/store/useDashboardStore";
import { FaBars, FaPlus } from "react-icons/fa";
import {
  Button,
  ConfirmationModal,
  ProjectSkeleton,
  PageHeader,
  ProjectList,
  ProjectForm,
} from "@/components";
import toast from "react-hot-toast";

const Projects = () => {
  const [searchParams] = useSearchParams();
  const { deleteProject } = useDashboardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Handling "Delete" state here because it interacts with the list directly
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    id: null,
  });

  useEffect(() => {
    if (searchParams.get("new")) setIsModalOpen(true);
  }, [searchParams]);

  const handleOpenModal = (project = null) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmState({
      isOpen: true,
      id: id,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProject(confirmState.id);
      toast.success("Project deleted successfully!");
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete project."
      );
    } finally {
      setConfirmState({ isOpen: false, id: null });
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
      <PageHeader
        title="Projects"
        description="Manage your portfolio projects."
        children={
          <Button
            onClick={() => handleOpenModal(null)}
            uiType="primary"
            icon={<FaPlus size={12} />}
            label="Add Project"
          />
        }
      />

      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <Suspense fallback={<ProjectSkeleton />}>
            <ProjectList onEdit={handleOpenModal} onDelete={handleDelete} />
          </Suspense>
        </div>
      </div>

      {isModalOpen && (
        <ProjectForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          projectToEdit={editingProject}
        />
      )}

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Project?"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
      />
    </div>
  );
};

export default Projects;
