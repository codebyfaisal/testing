import React, { useState, use, useMemo, Suspense } from "react";
import useDashboardStore from "../store/useDashboardStore";
import { motion } from "motion/react";
import { FaEdit, FaTrash, FaPlus, FaSave, FaMoneyBill } from "react-icons/fa";
import {
  Modal,
  Input,
  Textarea,
  Button,
  NotFound,
  ConfirmationModal,
  Select,
  PlanSkeleton,
} from "../components";
import toast from "react-hot-toast";

const PlanList = ({ onEdit, onDelete }) => {
  const { fetchPlans } = useDashboardStore();
  const plans = use(fetchPlans());

  if (!plans || plans.length === 0) {
    return (
      <NotFound
        Icon={FaMoneyBill}
        message="No plans found."
        className="col-span-full"
      />
    );
  }

  return (
    <>
      {plans.map((plan, index) => (
        <motion.div
          key={plan._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col max-w-md mx-auto"
        >
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-white mb-1">{plan.name}</h2>
            <h2 className="text-2xl font-bold text-indigo-400">
              {plan.price?.currency} {plan.price?.min}
              {plan.price?.max && ` - ${plan.price.max}`}
            </h2>
          </div>

          <div className="p-6 bg-zinc-950/50 grow">
            <h3 className="text-sm font-medium text-zinc-500 uppercase mb-4">
              Features
            </h3>
            <ul className="space-y-2 mb-4">
              {plan.features.map((feature, fIndex) => (
                <li
                  key={fIndex}
                  className="text-sm text-zinc-400 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0"></span>
                  {feature}
                </li>
              ))}
            </ul>

            {plan.addOns?.show && plan.addOns.options?.length > 0 && (
              <>
                <h3 className="text-sm font-medium text-zinc-500 uppercase mb-4 mt-6 border-t border-zinc-800 pt-4">
                  Add-Ons
                </h3>
                <ul className="space-y-2">
                  {plan.addOns.options.map((addon, aIndex) => (
                    <li
                      key={aIndex}
                      className="text-sm text-zinc-400 flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></span>
                      {addon}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="flex justify-evenly gap-2">
            <Button
              onClick={() => onEdit(plan)}
              uiType="text"
              icon={<FaEdit size={12} />}
              label="Edit"
            />
            <Button
              onClick={() => onDelete(plan._id)}
              uiType="text"
              icon={<FaTrash size={12} className="text-red-500" />}
              label="Delete"
            />
          </div>
        </motion.div>
      ))}
    </>
  );
};

const Plans = () => {
  const { addPlan, updatePlan, deletePlan } = useDashboardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const initialFormState = {
    name: "",
    minPrice: "",
    maxPrice: "",
    currency: "$",
    hasDelivery: false,
    deliveryTime: "",
    deliveryUnit: "Days",
    hasRevisions: false,
    revisions: "",
    features: [],
    hasAddOns: false,
    addOns: [],
    popular: false,
    isCustom: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [featuresInput, setFeaturesInput] = useState("");
  const [addOnsInput, setAddOnsInput] = useState("");

  const [initialData, setInitialData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    type: null,
    id: null,
  });

  const handleOpenModal = (plan = null) => {
    let initial;
    if (plan) {
      setEditingPlan(plan);
      const fInput = plan.features ? plan.features.join(", ") : "";
      const aInput = plan.addOns?.options ? plan.addOns.options.join(", ") : "";

      const data = {
        name: plan.name,
        minPrice: plan.price?.min || "",
        maxPrice: plan.price?.max || "",
        currency: plan.price?.currency || "$",
        hasDelivery: plan.deliveryTime?.show || false,
        deliveryTime: plan.deliveryTime?.time || "",
        deliveryUnit: plan.deliveryTime?.unit || "Days",
        hasRevisions: plan.revisions?.show || false,
        revisions: plan.revisions?.count || "",
        features: plan.features || [],
        hasAddOns: plan.addOns?.show || false,
        addOns: plan.addOns?.options || [],
        popular: plan.popular || false,
        isCustom: plan.isCustom || false,
      };

      setFormData(data);
      setFeaturesInput(fInput);
      setAddOnsInput(aInput);

      initial = {
        formData: data,
        featuresInput: fInput,
        addOnsInput: aInput,
      };
    } else {
      setEditingPlan(null);
      setFormData(initialFormState);
      setFeaturesInput("");
      setAddOnsInput("");

      initial = {
        formData: initialFormState,
        featuresInput: "",
        addOnsInput: "",
      };
    }
    setInitialData(initial);
    setIsModalOpen(true);
  };

  const isModalDirty = useMemo(() => {
    if (!initialData) return false;
    const currentData = {
      formData,
      featuresInput,
      addOnsInput,
    };
    return JSON.stringify(currentData) !== JSON.stringify(initialData);
  }, [formData, featuresInput, addOnsInput, initialData]);

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
    setEditingPlan(null);
    setInitialData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isModalDirty) return;

    const planData = {
      name: formData.name,
      price: {
        min: Number(formData.minPrice),
        max: Number(formData.maxPrice),
        currency: formData.currency,
      },
      deliveryTime: {
        show: formData.hasDelivery,
        time: Number(formData.deliveryTime),
        unit: formData.deliveryUnit,
      },
      revisions: {
        show: formData.hasRevisions,
        count: Number(formData.revisions),
      },
      features: featuresInput
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f),
      addOns: {
        show: formData.hasAddOns,
        options: addOnsInput
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a),
      },
      popular: formData.popular,
      isCustom: formData.isCustom,
    };

    if (editingPlan) {
      setConfirmState({
        isOpen: true,
        type: "update",
        id: editingPlan._id,
        data: planData,
      });
    } else {
      setIsSubmitting(true);
      try {
        await addPlan(planData);
        toast.success("Plan created successfully!");
        handleCloseModal(true);
      } catch (error) {
        console.error("Failed to create plan:", error);
        toast.error(error.message || "Failed to create plan.");
      } finally {
        setIsSubmitting(false);
      }
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
    setIsSubmitting(true);
    try {
      if (confirmState.type === "update") {
        await updatePlan(confirmState.id, confirmState.data);
        toast.success("Plan updated successfully!");
        handleCloseModal(true);
      } else if (confirmState.type === "delete") {
        await deletePlan(confirmState.id);
        toast.success("Plan deleted successfully!");
      } else if (confirmState.type === "discard") {
        handleCloseModal(true);
      }
    } catch (error) {
      console.error(`Failed to ${confirmState.type} plan:`, error);
      toast.error(error.message || `Failed to ${confirmState.type} plan.`);
    } finally {
      setIsSubmitting(false);
      setConfirmState({ isOpen: false, type: null, id: null });
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Plans</h1>
          <p className="text-zinc-400">
            Manage your pricing plans and features.
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          uiType="primary"
          icon={<FaPlus size={12} />}
          label="Add Plan"
        />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <Suspense fallback={<PlanSkeleton />}>
          <PlanList onEdit={handleOpenModal} onDelete={handleDelete} />
        </Suspense>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPlan ? "Edit Plan" : "Add New Plan"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Plan Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              placeholder="e.g. Basic, Pro"
              className="md:col-span-2"
            />
            <Input
              label="Currency"
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
              required
              placeholder="$"
              className="md:col-span-1"
            />
            <Input
              label="Min Price"
              type="number"
              value={formData.minPrice}
              onChange={(e) =>
                setFormData({ ...formData, minPrice: e.target.value })
              }
              placeholder="0"
              className="md:col-span-1"
            />
            <Input
              label="Max Price"
              type="number"
              value={formData.maxPrice}
              onChange={(e) =>
                setFormData({ ...formData, maxPrice: e.target.value })
              }
              placeholder="1000"
              className="md:col-span-1"
            />
            <Input
              label="Display Price (Opt)"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="Custom text"
              className="md:col-span-1"
            />
          </div>

          <Textarea
            label="Features (comma separated)"
            value={featuresInput}
            onChange={(e) => setFeaturesInput(e.target.value)}
            required
            placeholder="e.g. Feature 1, Feature 2"
            rows={3}
          />

          <div className="border-b border-zinc-800" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
            <Input
              label="Delivery Estimate"
              type="checkbox"
              checked={formData.hasDelivery}
              onChange={(e) =>
                setFormData({ ...formData, hasDelivery: e.target.checked })
              }
              className="flex items-center gap-2 justify-between [&>label]:w-full [&>input]:w-min col-span-full"
            />
            <Input
              label="Time"
              type="number"
              value={formData.deliveryTime}
              onChange={(e) =>
                setFormData({ ...formData, deliveryTime: e.target.value })
              }
              disabled={!formData.hasDelivery}
              placeholder="e.g. 3"
              className={`md:col-span-2 ${
                formData.hasDelivery ? "" : "opacity-50 cursor-not-allowed"
              }`}
            />
            <Select
              label="Unit"
              value={formData.deliveryUnit}
              onChange={(e) =>
                setFormData({ ...formData, deliveryUnit: e.target.value })
              }
              disabled={!formData.hasDelivery}
              options={[
                { value: "Days", label: "Days" },
                { value: "Weeks", label: "Weeks" },
                { value: "Months", label: "Months" },
              ]}
              className={`md:col-span-1 ${
                formData.hasDelivery ? "" : "opacity-25 cursor-not-allowed"
              }`}
            />
          </div>

          <div className="border-b border-zinc-800" />

          <div>
            <Input
              label="Total Revisions"
              type="checkbox"
              checked={formData.hasRevisions}
              onChange={(e) =>
                setFormData({ ...formData, hasRevisions: e.target.checked })
              }
              className="flex items-center gap-2 justify-between [&>label]:w-full [&>input]:w-min"
            />
            <Input
              type="number"
              value={formData.revisions}
              onChange={(e) =>
                setFormData({ ...formData, revisions: e.target.value })
              }
              placeholder="e.g. 3"
              disabled={!formData.hasRevisions}
              className={`w-full ${
                formData.hasRevisions ? "" : "opacity-50 cursor-not-allowed"
              }`}
            />
          </div>

          <div className="border-b border-zinc-800" />

          <div className="space-y-2">
            <Input
              label="Add-ons"
              type="checkbox"
              checked={formData.hasAddOns}
              onChange={(e) =>
                setFormData({ ...formData, hasAddOns: e.target.checked })
              }
              className="flex items-center gap-2 justify-between [&>label]:w-full [&>input]:w-min"
            />
            <Textarea
              value={addOnsInput}
              onChange={(e) => setAddOnsInput(e.target.value)}
              placeholder="Add-on 1, Add-on 2"
              rows={2}
              className={`w-full ${
                formData.hasAddOns ? "" : "opacity-30 cursor-not-allowed"
              }`}
              disabled={!formData.hasAddOns}
            />
          </div>

          <div className="flex gap-4">
            <Input
              label="Popular"
              type="checkbox"
              checked={formData.popular}
              onChange={(e) =>
                setFormData({ ...formData, popular: e.target.checked })
              }
              className="flex items-center gap-2 justify-between [&>label]:w-full [&>input]:w-min *:m-0"
            />

            <Input
              label="Custom Plan Style"
              type="checkbox"
              checked={formData.isCustom}
              onChange={(e) =>
                setFormData({ ...formData, isCustom: e.target.checked })
              }
              className="flex items-center gap-2 justify-between [&>label]:w-full [&>input]:w-min *:m-0"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button onClick={handleCloseModal} uiType="text" label="Cancel" />
            <Button
              uiType="primary"
              type="submit"
              disabled={isSubmitting || !isModalDirty}
              loading={isSubmitting}
              icon={<FaSave size={12} />}
              className={`bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-auto ${
                !isModalDirty && !isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              label={
                isSubmitting
                  ? "Saving..."
                  : editingPlan
                  ? "Update Plan"
                  : "Create Plan"
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
            ? "Delete Plan?"
            : confirmState.type === "discard"
            ? "Discard Changes?"
            : "Update Plan?"
        }
        message={
          confirmState.type === "delete"
            ? "Are you sure you want to delete this plan? This action cannot be undone."
            : confirmState.type === "discard"
            ? "You have unsaved changes. Are you sure you want to discard them?"
            : "Are you sure you want to update this plan with the new details?"
        }
        confirmText={
          confirmState.type === "delete"
            ? "Delete"
            : confirmState.type === "discard"
            ? "Discard"
            : "Update"
        }
        isDangerous={
          confirmState.type === "delete" || confirmState.type === "discard"
        }
      />
    </div>
  );
};

export default Plans;
