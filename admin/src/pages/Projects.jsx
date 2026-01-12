import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useDashboardStore from "@/store/useDashboardStore";
import {
  FaPlus,
  FaProjectDiagram,
  FaFilter,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import {
  Button,
  ConfirmationModal,
  ProjectSkeleton,
  PageHeader,
  ProjectList,
  ProjectForm,
  NotFound,
  RightSidebar,
  Input,
} from "@/components";
import toast from "react-hot-toast";

const Projects = () => {
  const [searchParams] = useSearchParams();
  const {
    deleteProject,
    fetchProjects,
    projects,
    isLoading,
    resetProjectState,
  } = useDashboardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    techStack: "",
  });

  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    id: null,
  });

  useEffect(() => {
    fetchProjects();
    return () => resetProjectState();
  }, [fetchProjects, resetProjectState]);

  useEffect(() => {
    if (searchParams.get("new")) setIsModalOpen(true);
  }, [searchParams]);

  // Filter Logic
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter((project) => {
      const matchesSearch = project.title
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());

      const matchesTech =
        filters.techStack === "" ||
        (Array.isArray(project.techStack)
          ? project.techStack.some((tech) =>
              tech.toLowerCase().includes(filters.techStack.toLowerCase())
            )
          : project.techStack
              ?.toLowerCase()
              .includes(filters.techStack.toLowerCase()));

      return matchesSearch && matchesTech;
    });
  }, [projects, filters]);

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
      >
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(true)}
            uiType="secondary"
            icon={<FaFilter />}
            label="Filters"
          />
          <Button
            onClick={() => handleOpenModal(null)}
            uiType="primary"
            icon={<FaPlus size={12} />}
            label="Add Project"
          />
        </div>
      </PageHeader>

      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            <ProjectSkeleton />
          ) : !projects || projects.length === 0 ? (
            <NotFound
              Icon={FaProjectDiagram}
              message="No projects created yet."
              className="w-full h-full flex flex-col items-center justify-center text-muted-foreground"
            />
          ) : !filteredProjects || filteredProjects.length === 0 ? (
            <NotFound
              Icon={FaProjectDiagram}
              message="No projects found matching your criteria."
              className="w-full h-full flex flex-col items-center justify-center text-muted-foreground"
            />
          ) : (
            <ProjectList
              projects={filteredProjects}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          )}
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

      <RightSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Projects"
        footer={
          <div className="flex gap-2">
            <Button
              onClick={() => setFilters({ search: "", techStack: "" })}
              label="Reset"
              uiType="secondary"
              className="w-full"
              icon={<FaTimes />}
            />
            <Button
              onClick={() => setShowFilters(false)}
              label="Done"
              uiType="primary"
              className="w-full"
            />
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Search Projects"
            placeholder="Search by title..."
            icon={<FaSearch />}
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
          <Input
            label="Tech Stack"
            placeholder="e.g. React, Node..."
            value={filters.techStack}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, techStack: e.target.value }))
            }
          />
          <div className="text-xs text-muted-foreground">
            <p>
              Filtering {filteredProjects.length} of {projects?.length || 0}{" "}
              projects
            </p>
          </div>
        </div>
      </RightSidebar>
    </div>
  );
};

export default Projects;
