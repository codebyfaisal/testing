import React, { useState, useEffect, useMemo } from "react";
import {
  FaSave,
  FaLink,
  FaEdit,
  FaTrash,
  FaPlus,
  FaWpforms,
  FaFilter,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  Button,
  ConfirmationModal,
  Select,
  NotFound,
  Modal,
  Input,
  Textarea,
  Card,
  PageHeader,
  FormSkeleton,
  QuestionBuilder,
  RightSidebar,
  FadeIn,
} from "@/components";
import useDashboardStore from "@/store/useDashboardStore";

const Forms = () => {
  const {
    forms,
    fetchForms,
    addForm,
    updateForm,
    deleteForm,
    isLoading,
    resetFormState,
  } = useDashboardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formToEdit, setFormToEdit] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const initialFormState = {
    title: "",
    description: "",
    isActive: true,
    expiryDate: "",
    questions: [],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "", // "active", "inactive", ""
  });

  useEffect(() => {
    fetchForms();
    return () => resetFormState();
  }, [fetchForms, resetFormState]);

  useEffect(() => {
    if (formToEdit) {
      setFormData({
        title: formToEdit.title || "",
        description: formToEdit.description || "",
        isActive: formToEdit.isActive,
        expiryDate: formToEdit.expiryDate
          ? new Date(formToEdit.expiryDate).toISOString().split("T")[0]
          : "",
        questions: formToEdit.questions || [],
      });
    } else {
      setFormData(initialFormState);
    }
  }, [formToEdit]);

  const isFormActive = (form) => {
    if (!form.isActive) return false;
    if (form.expiryDate && new Date(form.expiryDate) < new Date()) return false;
    return true;
  };

  // Filter Logic
  const filteredForms = useMemo(() => {
    if (!forms) return [];
    return forms.filter((form) => {
      const matchesSearch = form.title
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());

      const active = isFormActive(form);
      const matchesStatus =
        filters.status === "" ||
        (filters.status === "active" && active) ||
        (filters.status === "inactive" && !active);

      return matchesSearch && matchesStatus;
    });
  }, [forms, filters]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormToEdit(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return toast.error("Title is required");

    setIsSubmitting(true);
    try {
      if (formToEdit) {
        await updateForm(formToEdit._id, formData);
        toast.success("Form updated!");
      } else {
        await addForm(formData);
        toast.success("Form created!");
      }
      handleCloseModal();
    } catch (error) {
      toast.error("Failed to save form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteForm(deleteId);
      toast.success("Form deleted");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete form");
    }
  };

  const copyLink = (id) => {
    // Construct public URL using ID
    const url = `${window.location.protocol}//${window.location.hostname}:5173/forms/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
      <PageHeader
        title="Standalone Forms"
        description="Create and manage shareable forms not tied to specific job openings."
      >
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(true)}
            uiType="secondary"
            icon={<FaFilter />}
            label="Filters"
          />
          <Button
            onClick={() => setIsModalOpen(true)}
            label="Create Form"
            icon={<FaPlus />}
          />
        </div>
      </PageHeader>

      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <FormSkeleton />
          ) : !forms || forms.length === 0 ? (
            <NotFound Icon={FaWpforms} message="No forms created yet." />
          ) : !filteredForms || filteredForms.length === 0 ? (
            <NotFound
              Icon={FaWpforms}
              message="No forms found matching criteria."
            />
          ) : (
            filteredForms.map((form) => {
              const active = isFormActive(form);
              return (
                <Card key={form._id} padding="">
                  <div className="p-6">
                    <h3 className="font-bold text-foreground text-lg">
                      {form.title}
                    </h3>
                    <div className="flex gap-2 items-center">
                      <span
                        className={`inline-flex mt-2 items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          active
                            ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/10"
                            : "text-muted-foreground border-border bg-muted/50"
                        }`}
                      >
                        {active ? "Active" : "Inactive"}
                      </span>
                      {form.expiryDate && (
                        <span className="block mt-1 text-xs text-muted-foreground">
                          Expires:{" "}
                          {new Date(form.expiryDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                      {form.description || "No description provided."}
                    </p>
                  </div>

                  <div className="px-6 py-2 border-t border-border flex items-center justify-between">
                    <Button
                      onClick={() => copyLink(form._id)}
                      uiType="action"
                      icon={<FaLink />}
                      label={copiedId === form._id ? "Copied!" : "Copy Link"}
                      title="Copy Form Link"
                    />
                    <div>
                      <Button
                        onClick={() => {
                          setFormToEdit(form);
                          setIsModalOpen(true);
                        }}
                        uiType="action"
                        icon={<FaEdit />}
                        title="Edit Form"
                      />
                      <Button
                        onClick={() => setDeleteId(form._id)}
                        uiType="action"
                        icon={<FaTrash />}
                        title="Delete Form"
                      />
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <RightSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Forms"
        footer={
          <div className="flex gap-2">
            <Button
              onClick={() => setFilters({ search: "", status: "" })}
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
            label="Search Forms"
            placeholder="Search by title..."
            icon={<FaSearch />}
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />

          <Select
            label="Status"
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            options={[
              { value: "", label: "All Statuses" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />

          <div className="text-xs text-muted-foreground">
            <p>
              Filtering {filteredForms.length} of {forms?.length || 0} forms
            </p>
          </div>
        </div>
      </RightSidebar>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={formToEdit ? "Edit Form" : "Create New Form"}
        maxWidth="4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <Input
                label="Form Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                placeholder="e.g. General Inquiry"
              />
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the purpose of this form..."
                rows={3}
              />
            </div>
            <div className="space-y-4">
              <Select
                label="Status"
                value={formData.isActive}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isActive: e.target.value === "true",
                  })
                }
                options={[
                  { value: true, label: "Active" },
                  { value: false, label: "Inactive" },
                ]}
              />
              <Input
                label="Mx Expiry Date"
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Default Fields
              </h3>
              <span className="text-xs text-muted-foreground uppercase tracking-widest border border-border px-2 py-0.5 rounded">
                Fixed
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              These fields are included in every form to identify the applicant.
            </p>
            <div className="grid grid-cols-2 gap-4 opacity-50 select-none cursor-not-allowed">
              <Input label="Full Name" disabled placeholder="Applicant Name" />
              <Input
                label="Email Address"
                disabled
                placeholder="Applicant Email"
              />
              <Input label="Resume Link" disabled placeholder="URL" />
              <Textarea
                label="Cover Letter"
                disabled
                placeholder="Why should we contact you?"
                rows={2}
              />
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Custom Fields
            </h3>
            <QuestionBuilder
              questions={formData.questions}
              onChange={(newQuestions) =>
                setFormData({ ...formData, questions: newQuestions })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              uiType="text"
              label="Cancel"
              onClick={handleCloseModal}
              type="button"
            />
            <Button
              uiType="primary"
              label={isSubmitting ? "Saving..." : "Save Form"}
              type="submit"
              disabled={isSubmitting}
              icon={<FaSave />}
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Form?"
        message="Are you sure you want to delete this form? This cannot be undone."
        confirmText="Delete"
        isDangerous
      />
    </div>
  );
};

export default Forms;
