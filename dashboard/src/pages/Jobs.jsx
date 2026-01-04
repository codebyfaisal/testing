import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaBriefcase, FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import {
  PageHeader,
  Button,
  ConfirmationModal,
  NotFound,
  JobSkeleton,
  Card,
  JobForm,
} from "@/components";
import useDashboardStore from "@/store/useDashboardStore";
import toast from "react-hot-toast";

const Jobs = () => {
  const { jobs, fetchJobs, deleteJob, isLoading } = useDashboardStore();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

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
        {isLoading && jobs?.length === 0 ? (
          <JobSkeleton />
        ) : jobs?.length === 0 ? (
          <NotFound Icon={FaBriefcase} message="No job postings found." />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {jobs?.map((job) => (
              <Card
                key={job._id}
                className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-foreground">
                      {job.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full border ${
                        job.status === "Open"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <div className="text-muted-foreground text-sm flex gap-4">
                    <span>{job.type}</span>
                    <span>&bull;</span>
                    <span>{job.location}</span>
                    {job.salary && (
                      <>
                        <span>&bull;</span>
                        <span>
                          {job.salary.min} - {job.salary.max}{" "}
                          {job.salary.currency}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    uiType="secondary"
                    icon={<FaUsers />}
                    label="Applications"
                    onClick={() => navigate(`/applications?jobId=${job._id}`)}
                    title="View Applications"
                  />
                  <Button
                    onClick={() => {
                      setJobToEdit(job);
                      setIsFormOpen(true);
                    }}
                    uiType="text"
                    icon={<FaEdit />}
                    className="text-primary hover:text-primary/80"
                  />
                  <Button
                    onClick={() => setDeleteId(job._id)}
                    uiType="text"
                    icon={<FaTrash />}
                    className="text-destructive hover:text-destructive/80"
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
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
