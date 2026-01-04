import React, { useState, Suspense, useEffect } from "react";
import useDashboardStore from "@/store/useDashboardStore";
import { FaPlus } from "react-icons/fa";
import {
  PageHeader,
  Button,
  ConfirmationModal,
  TestimonialSkeleton,
  TestimonialList,
  TestimonialForm,
} from "@/components";
import toast from "react-hot-toast";

const Testimonials = () => {
  const { deleteTestimonial } = useDashboardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    id: null,
  });

  const handleOpenModal = (testimonial = null) => {
    setEditingTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmState({
      isOpen: true,
      id: id,
    });
  };

  const handleConfirmAction = async () => {
    try {
      if (confirmState.id) {
        await deleteTestimonial(confirmState.id);
        toast.success("Testimonial deleted successfully!");
      }
    } catch (error) {
      console.error("Failed to delete testimonial:", error);
      toast.error(error.message || "Failed to delete testimonial.");
    } finally {
      setConfirmState({ isOpen: false, id: null });
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
      <PageHeader
        title="Testimonials"
        description="Manage client reviews and feedback."
        children={
          <Button
            onClick={() => handleOpenModal()}
            uiType="primary"
            icon={<FaPlus />}
            label="Add Testimonial"
          />
        }
      />

      {/* Testimonials Grid */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <Suspense fallback={<TestimonialSkeleton />}>
            <TestimonialList onEdit={handleOpenModal} onDelete={handleDelete} />
          </Suspense>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <TestimonialForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          testimonialToEdit={editingTestimonial}
        />
      )}

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, id: null })}
        onConfirm={handleConfirmAction}
        title="Delete Testimonial?"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
      />
    </div>
  );
};

export default Testimonials;
