import React, { useState, useEffect } from "react";
import useDashboardStore from "@/store/useDashboardStore";
import { FaPlus, FaMoneyBill } from "react-icons/fa";
import {
  PageHeader,
  Button,
  ConfirmationModal,
  PlanSkeleton,
  PlanList,
  PlanForm,
  NotFound,
  FadeIn,
} from "@/components";
import toast from "react-hot-toast";

const Plans = () => {
  const { deletePlan, fetchPlans, plans, isLoading, resetPlanState } =
    useDashboardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    id: null,
  });

  useEffect(() => {
    fetchPlans();
    return () => resetPlanState();
  }, [fetchPlans, resetPlanState]);

  const handleOpenModal = (plan = null) => {
    setEditingPlan(plan);
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
      await deletePlan(confirmState.id);
      toast.success("Plan deleted successfully!");
    } catch (error) {
      console.error("Failed to delete plan:", error);
      toast.error(error.message || "Failed to delete plan.");
    } finally {
      setConfirmState({ isOpen: false, id: null });
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
      <PageHeader
        title="Plans"
        description="Manage your pricing plans and features."
        children={
          <Button
            onClick={() => handleOpenModal(null)}
            uiType="primary"
            icon={<FaPlus size={12} />}
            label="Add Plan"
          />
        }
      />

      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            <PlanSkeleton />
          ) : !plans || plans.length === 0 ? (
            <NotFound
              Icon={FaMoneyBill}
              message="No plans created yet."
              className="w-full h-full flex flex-col items-center justify-center"
            />
          ) : (
            <PlanList
              plans={plans}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {isModalOpen && (
        <PlanForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planToEdit={editingPlan}
        />
      )}

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Plan?"
        message="Are you sure you want to delete this plan? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
      />
    </div>
  );
};

export default Plans;
