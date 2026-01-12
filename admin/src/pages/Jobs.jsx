import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaBriefcase } from "react-icons/fa";
import {
  PageHeader,
  Button,
  ConfirmationModal,
  NotFound,
  JobSkeleton,
  JobForm,
  JobList,
  FadeIn,
} from "@/components";
import useDashboardStore from "@/store/useDashboardStore";
import toast from "react-hot-toast";

const Jobs = () => {
  const { jobs, fetchJobs, deleteJob, isLoading, resetJobsState } =
    useDashboardStore();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchJobs();
    return () => resetJobsState();
  }, [fetchJobs, resetJobsState]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteJob(deleteId);
      toast.success("Job deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
      <PageHeader
        title="Jobs"
        description="Manage your job postings and openings."
      >
        <Button
          onClick={() => {
            setJobToEdit(null);
            setIsFormOpen(true);
          }}
          uiType="primary"
          icon={<FaPlus />}
          label="Post New Job"
        />
      </PageHeader>

      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <JobSkeleton />
          ) : !jobs || jobs.length === 0 ? (
            <NotFound
              Icon={FaBriefcase}
              message="No job postings created yet."
            />
          ) : (
            <JobList
              jobs={jobs}
              onEdit={(job) => {
                setJobToEdit(job);
                setIsFormOpen(true);
              }}
              onDelete={setDeleteId}
            />
          )}
        </div>
      </div>

      <JobForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        jobToEdit={jobToEdit}
      />

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Job?"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
      />
    </div>
  );
};

export default Jobs;
