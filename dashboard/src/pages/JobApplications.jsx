import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import {
  PageHeader,
  Button,
  ConfirmationModal,
  NotFound,
  ApplicationSkeleton,
  Modal,
  Select,
  Input,
  Card,
} from "@/components";

import toast from "react-hot-toast";

import {
  FaTrash,
  FaExternalLinkAlt,
  FaCheck,
  FaTimes,
  FaSearch,
  FaEye,
  FaInbox,
  FaFilter,
} from "react-icons/fa";
import RightSidebar from "../components/ui/RightSidebar";
import useDashboardStore from "@/store/useDashboardStore";

const JobApplications = () => {
  const {
    applications,
    fetchApplications,
    updateApplicationStatus,
    deleteApplication,
    isApplicationsLoading,
  } = useDashboardStore();
  const [deleteId, setDeleteId] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const initJobId = searchParams.get("jobId") || "";

  const [filters, setFilters] = useState({
    search: "",
    jobId: initJobId,
    status: "",
    from: "",
    to: "",
  });

  const { jobs, fetchJobs } = useDashboardStore();

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Debounce search and fetch
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchApplications(filters);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchApplications, filters]);

  // Update URL when filtering by job
  useEffect(() => {
    if (filters.jobId) setSearchParams({ jobId: filters.jobId });
    else setSearchParams({});
  }, [filters.jobId, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: "", jobId: "", status: "", from: "", to: "" });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteApplication(deleteId);
      toast.success("Application deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete application");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      toast.success(`Marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
      <PageHeader
        title="Applications"
        description="Review applications for your job postings."
        actions={
          <Button
            onClick={() => setShowFilters(true)}
            icon={<FaFilter />}
            label="Filters"
            uiType=""
            className="hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-300"
          />
        }
      />

      <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-6">
        {isApplicationsLoading && applications.length === 0 ? (
          <ApplicationSkeleton />
        ) : applications.length === 0 ? (
          <NotFound Icon={FaInbox} message="No applications received yet." />
        ) : (
          <Card className="overflow-x-auto" padding="p-0">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4 hidden md:table-cell">Job Title</th>
                  <th className="px-6 py-4 hidden lg:table-cell">
                    Applied Date
                  </th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 hidden xl:table-cell">Links</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((app) => (
                  <tr
                    key={app._id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          {app.applicant?.name || app.fullName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {app.applicant?.email || app.email}
                        </span>
                        <span className="text-xs text-primary md:hidden mt-0.5">
                          {app.job?.title || app.form?.title || "Unknown Form"}
                        </span>
                        {app.coverLetter && (
                          <span className="text-xs text-muted-foreground mt-1 line-clamp-1 italic hidden sm:block">
                            "{app.coverLetter}"
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground hidden md:table-cell">
                      {app.job?.title || app.form?.title || "Unknown"}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          app.status === "Reviewed"
                            ? "text-blue-400 border-blue-400/20 bg-blue-400/10"
                            : app.status === "Shortlisted"
                            ? "text-green-400 border-green-400/20 bg-green-400/10"
                            : app.status === "Rejected"
                            ? "text-red-400 border-red-400/20 bg-red-400/10"
                            : "text-yellow-400 border-yellow-400/20 bg-yellow-400/10"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <div className="flex gap-3">
                        {(app.applicant?.resumeLink || app.resumeLink) && (
                          <a
                            href={app.applicant?.resumeLink || app.resumeLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:text-primary/80 flex items-center gap-1"
                            title="View Resume"
                          >
                            <span className="sr-only">Resume</span>
                            <FaExternalLinkAlt size={12} /> Resume
                          </a>
                        )}
                        {(app.applicant?.portfolioLink ||
                          app.portfolioLink) && (
                          <a
                            href={
                              app.applicant?.portfolioLink || app.portfolioLink
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="text-pink-400 hover:text-pink-300 flex items-center gap-1"
                            title="View Portfolio"
                          >
                            <span className="sr-only">Portfolio</span>
                            <FaExternalLinkAlt size={12} /> Portfolio
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => setSelectedApp(app)}
                          uiType="secondary"
                          className="p-1.5! text-blue-400 hover:bg-blue-400/10"
                          icon={<FaEye size={12} />}
                          title="View Details"
                        />
                        <Button
                          onClick={() =>
                            handleStatusUpdate(app._id, "Shortlisted")
                          }
                          uiType="secondary"
                          className="p-1.5! text-green-500 hover:bg-green-500/10"
                          icon={<FaCheck size={12} />}
                          title="Shortlist"
                        />
                        <Button
                          onClick={() =>
                            handleStatusUpdate(app._id, "Rejected")
                          }
                          uiType="secondary"
                          className="p-1.5! text-red-500 hover:bg-red-500/10"
                          icon={<FaTimes size={12} />}
                          title="Reject"
                        />
                        <Button
                          onClick={() => setDeleteId(app._id)}
                          uiType="text"
                          className="p-1.5! text-muted-foreground hover:text-destructive"
                          icon={<FaTrash size={12} />}
                          title="Delete"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Application?"
        message="Are you sure you want to delete this application permanently?"
        confirmText="Delete"
        isDangerous={true}
      />

      {/* Application Details Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title="Application Details"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase">
                Applicant
              </h3>
              <p className="text-xl font-bold text-foreground">
                {selectedApp.applicant?.name || selectedApp.fullName}
              </p>
              <p className="text-muted-foreground">
                {selectedApp.applicant?.email || selectedApp.email}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase">
                  Applied For
                </h3>
                <p className="text-foreground font-medium">
                  {selectedApp.job?.title ||
                    selectedApp.form?.title ||
                    "General Application"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase">
                  Status
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    selectedApp.status === "Reviewed"
                      ? "text-blue-400 border-blue-400/20 bg-blue-400/10"
                      : selectedApp.status === "Shortlisted"
                      ? "text-green-400 border-green-400/20 bg-green-400/10"
                      : selectedApp.status === "Rejected"
                      ? "text-red-400 border-red-400/20 bg-red-400/10"
                      : "text-yellow-400 border-yellow-400/20 bg-yellow-400/10"
                  }`}
                >
                  {selectedApp.status}
                </span>
              </div>
            </div>

            {selectedApp.coverLetter && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">
                  Cover Letter
                </h3>
                <div className="p-4 bg-muted/20 border border-border rounded-lg text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                  {selectedApp.coverLetter}
                </div>
              </div>
            )}

            {selectedApp.answers && selectedApp.answers.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">
                  Questionnaire
                </h3>
                <div className="space-y-3 bg-muted/20 border border-border rounded-lg p-4">
                  {selectedApp.answers.map((ans, idx) => (
                    <div
                      key={idx}
                      className="border-b border-border last:border-0 pb-3 last:pb-0"
                    >
                      <p className="text-muted-foreground text-sm mb-1">
                        {ans.label}
                      </p>
                      <p className="text-foreground">
                        {Array.isArray(ans.answer)
                          ? ans.answer.join(", ")
                          : ans.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">
                Attachments
              </h3>
              <div className="flex gap-4">
                {selectedApp.applicant?.resumeLink || selectedApp.resumeLink ? (
                  <a
                    href={
                      selectedApp.applicant?.resumeLink ||
                      selectedApp.resumeLink
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-primary hover:bg-primary/20 transition-colors"
                  >
                    <FaExternalLinkAlt size={12} /> Resume
                  </a>
                ) : (
                  <span className="text-muted-foreground text-sm italic">
                    No Resume provided
                  </span>
                )}
                {(selectedApp.applicant?.portfolioLink ||
                  selectedApp.portfolioLink) && (
                  <a
                    href={
                      selectedApp.applicant?.portfolioLink ||
                      selectedApp.portfolioLink
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-lg text-pink-400 hover:bg-pink-500/20 transition-colors"
                  >
                    <FaExternalLinkAlt size={12} /> Portfolio
                  </a>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button
                onClick={() => setSelectedApp(null)}
                uiType="secondary"
                label="Close"
              />
            </div>
          </div>
        </Modal>
      )}
      <RightSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Applications"
        footer={
          <div className="flex gap-2">
            <Button
              onClick={clearFilters}
              label="Reset Filters"
              uiType="secondary"
              className="w-full"
              icon={<FaTimes />}
            />
            <Button
              onClick={() => setShowFilters(false)}
              label="Run Search"
              uiType="primary"
              className="w-full"
              icon={<FaSearch />}
            />
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            placeholder="Search by name or email..."
            icon={<FaSearch />}
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            label="Search Query"
          />
          <Select
            label="Job Position"
            value={filters.jobId}
            onChange={(value) => handleFilterChange("jobId", value)}
            options={[
              { value: "", label: "All Jobs" },
              ...jobs.map((j) => ({ value: j._id, label: j.title })),
            ]}
          />
          <Select
            label="Application Status"
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            options={[
              { value: "", label: "All Statuses" },
              { value: "Pending", label: "Pending" },
              { value: "Reviewed", label: "Reviewed" },
              { value: "Shortlisted", label: "Shortlisted" },
              { value: "Rejected", label: "Rejected" },
            ]}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={filters.from}
              onChange={(e) => handleFilterChange("from", e.target.value)}
              max={filters.to}
              label="From Date"
            />
            <Input
              type="date"
              value={filters.to}
              onChange={(e) => handleFilterChange("to", e.target.value)}
              min={filters.from}
              max={new Date().toISOString().split("T")[0]}
              label="To Date"
            />
          </div>
        </div>
      </RightSidebar>
    </div>
  );
};

export default JobApplications;
