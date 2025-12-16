import React, { useState, use, useMemo, Suspense } from "react";
import useDashboardStore from "../store/useDashboardStore";
import { motion } from "motion/react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaServicestack,
} from "react-icons/fa";
import {
  Modal,
  Input,
  Textarea,
  Button,
  NotFound,
  RenderIcon,
  ConfirmationModal,
  ServiceSkeleton,
} from "../components";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const ServiceList = ({ onEdit, onDelete }) => {
  const { fetchServices } = useDashboardStore();
  const services = use(fetchServices());

  if (!services || services.length === 0) {
    return (
      <NotFound
        Icon={FaServicestack}
        message="No services found."
        className="col-span-full"
      />
    );
  }

  return (
    <>
      {services.map((service, index) => (
        <motion.div
          key={service._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
        >
          <div className="flex flex-col justify-between h-full gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-lg text-2xl px-4 pt-4">
                <RenderIcon icon={service.icon} />
              </div>

              <h2 className="text-xl font-bold text-white px-4">
                {service.title}
              </h2>
              <p className="text-zinc-400 text-sm px-4">
                {service.description}
              </p>
            </div>
            <div className="flex justify-center gap-2 bg-zinc-800 w-full p-2 mt-4">
              <Button
                onClick={() => onEdit(service)}
                uiType="text"
                icon={<FaEdit size={12} />}
                label="Edit"
              />
              <Button
                onClick={() => onDelete(service._id)}
                uiType="text"
                icon={<FaTrash size={12} />}
                label="Delete"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addService, updateService, deleteService } = useDashboardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    if (searchParams.get("new")) setIsModalOpen(true);
  }, [searchParams]);

  // Initial State for Form Data
  const initialFormState = {
    title: "",
    description: "",
    icon: "",
    features: [],
    whyChooseMe: [],
    techStack: [],
    process: [],
    faq: [],
    cta: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [initialFormData, setInitialFormData] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    type: null,
    id: null,
  });

  const handleOpenModal = (service = null) => {
    let initialData;
    if (service) {
      setEditingService(service);
      initialData = {
        title: service.title || "",
        description: service.description || "",
        icon: service.icon || "",
        features: service.features || [],
        whyChooseMe: service.whyChooseMe || [],
        techStack: service.techStack || [],
        process: service.process || [],
        faq: service.faq || [],
        cta: service.cta || "",
      };
      setFormData(initialData);
    } else {
      setEditingService(null);
      initialData = initialFormState;
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
    setSearchParams({});
    setIsModalOpen(false);
    setEditingService(null);
    setInitialFormData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isModalDirty) return;

    const processedData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      icon: formData.icon.trim(),
      cta: (formData.cta || "").trim(),
      features: formData.features.map((f) => f.trim()).filter((f) => f !== ""),
      whyChooseMe: formData.whyChooseMe
        .map((item) => ({
          title: item.title.trim(),
          description: item.description.trim(),
          icon: item.icon.trim(),
        }))
        .filter((item) => item.title !== "" || item.description !== ""),
      techStack: formData.techStack
        .map((item) => ({
          name: item.name.trim(),
          icon: item.icon.trim(),
        }))
        .filter((item) => item.name !== ""),
      process: formData.process
        .map((item) => ({
          title: item.title.trim(),
          description: item.description.trim(),
          icon: item.icon.trim(),
        }))
        .filter((item) => item.title !== ""),
      faq: formData.faq
        .map((item) => ({
          question: item.question.trim(),
          answer: item.answer.trim(),
          required: true,
        }))
        .filter((item) => item.question !== "" || item.answer !== ""),
    };

    processedData.faq = formData.faq
      .map((item) => ({
        question: item.question.trim(),
        answer: item.answer.trim(),
      }))
      .filter((item) => item.question !== "" || item.answer !== "");

    if (!processedData.title) {
      toast.error("Title is required");
      return;
    }

    if (editingService) {
      setConfirmState({
        isOpen: true,
        type: "update",
        id: editingService._id,
        payload: processedData,
      });
    } else {
      setIsSubmitting(true);
      try {
        await addService(processedData);
        toast.success("Service created successfully!");
        handleCloseModal(true);
      } catch (error) {
        toast.error(error.message || "Failed to create service.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = (id) => {
    setConfirmState({
      isOpen: true,
      type: "delete",
      id,
    });
  };

  const handleConfirmAction = async () => {
    setIsSubmitting(true);
    try {
      if (confirmState.type === "update") {
        await updateService(confirmState.id, confirmState.payload || formData);
        toast.success("Service updated successfully!");
        handleCloseModal(true);
      } else if (confirmState.type === "delete") {
        await deleteService(confirmState.id);
        toast.success("Service deleted successfully!");
      } else if (confirmState.type === "discard") {
        handleCloseModal(true);
      }
    } catch (error) {
      toast.error(error.message || `Failed to ${confirmState.type} service.`);
    } finally {
      setIsSubmitting(false);
      setConfirmState({ isOpen: false, type: null, id: null });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-zinc-400">Manage the services you offer.</p>
        </div>

        <Button
          onClick={() => handleOpenModal()}
          uiType="primary"
          icon={<FaPlus size={12} />}
          label="Add Service"
        />
      </header>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense fallback={<ServiceSkeleton />}>
          <ServiceList onEdit={handleOpenModal} onDelete={handleDelete} />
        </Suspense>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingService ? "Edit Service" : "Add New Service"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">
              Basic Info
            </h3>
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            {/* Icon */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <Input
                  label="Icon (Iconify or SimpleIcons)"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="e.g. mdi:code"
                  required
                />
                <RenderIcon
                  icon={formData.icon}
                  className="translate-y-[20%]"
                />
              </div>
            </div>
            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          {/* Section: Core Features (List of Strings) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <h3 className="text-lg font-semibold text-white">
                Core Features (List)
              </h3>
              <Button
                onClick={() =>
                  setFormData({
                    ...formData,
                    features: [...formData.features, ""],
                  })
                }
                uiType="secondary"
                icon={<FaPlus size={12} />}
                label="Add Feature"
                style={{ padding: "0.5rem 1rem" }}
                type="button"
              />
            </div>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...formData.features];
                      newFeatures[index] = e.target.value;
                      setFormData({ ...formData, features: newFeatures });
                    }}
                    placeholder={`Feature ${
                      index + 1
                    } (e.g. "Responsive Design")`}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => {
                      const newFeatures = formData.features.filter(
                        (_, i) => i !== index
                      );
                      setFormData({ ...formData, features: newFeatures });
                    }}
                    uiType="secondary"
                    icon={<FaTrash size={12} />}
                    className="hover:text-red-400"
                    type="button"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section: Why Choose Me */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <h3 className="text-lg font-semibold text-white">
                Why Choose Me
              </h3>
              <Button
                onClick={() =>
                  setFormData({
                    ...formData,
                    whyChooseMe: [
                      ...formData.whyChooseMe,
                      { title: "", description: "", icon: "" },
                    ],
                  })
                }
                uiType="secondary"
                icon={<FaPlus size={12} />}
                label="Add Item"
                type="button"
                style={{ padding: "0.5rem 1rem" }}
              />
            </div>
            <div className="space-y-4">
              {formData.whyChooseMe.map((item, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg space-y-3 relative"
                >
                  <div className="absolute top-2 right-2">
                    <Button
                      onClick={() => {
                        const newItems = formData.whyChooseMe.filter(
                          (_, i) => i !== index
                        );
                        setFormData({ ...formData, whyChooseMe: newItems });
                      }}
                      uiType="text"
                      icon={<FaTrash size={12} />}
                      className="text-red-500"
                      type="button"
                      style={{ padding: "0.5rem 1rem" }}
                    />
                  </div>
                  <Input
                    label="Title"
                    value={item.title}
                    onChange={(e) => {
                      const newItems = [...formData.whyChooseMe];
                      newItems[index].title = e.target.value;
                      setFormData({ ...formData, whyChooseMe: newItems });
                    }}
                    placeholder="e.g. Fast Delivery"
                  />
                  <Input
                    label="Icon"
                    value={item.icon}
                    onChange={(e) => {
                      const newItems = [...formData.whyChooseMe];
                      newItems[index].icon = e.target.value;
                      setFormData({ ...formData, whyChooseMe: newItems });
                    }}
                    placeholder="e.g. mdi:clock"
                  />
                  <Textarea
                    label="Description"
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...formData.whyChooseMe];
                      newItems[index].description = e.target.value;
                      setFormData({ ...formData, whyChooseMe: newItems });
                    }}
                    placeholder="Short explanation..."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section: Tech Stack */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <h3 className="text-lg font-semibold text-white">Tech Stack</h3>
              <Button
                onClick={() =>
                  setFormData({
                    ...formData,
                    techStack: [...formData.techStack, { name: "", icon: "" }],
                  })
                }
                uiType="secondary"
                icon={<FaPlus size={12} />}
                label="Add Tech"
                type="button"
                style={{ padding: "0.5rem 1rem" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {formData.techStack.map((item, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg space-y-2 relative"
                >
                  <div className="absolute top-1 right-1">
                    <Button
                      onClick={() => {
                        const newItems = formData.techStack.filter(
                          (_, i) => i !== index
                        );
                        setFormData({ ...formData, techStack: newItems });
                      }}
                      uiType="text"
                      icon={<FaTrash size={10} />}
                      className="text-red-500"
                      type="button"
                      style={{ padding: "0.5rem 1rem" }}
                    />
                  </div>
                  <Input
                    label="Name"
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...formData.techStack];
                      newItems[index].name = e.target.value;
                      setFormData({ ...formData, techStack: newItems });
                    }}
                    placeholder="e.g. React"
                  />
                  <div className="flex gap-2 items-center">
                    <div className="flex-1">
                      <Input
                        value={item.icon}
                        onChange={(e) => {
                          const newItems = [...formData.techStack];
                          newItems[index].icon = e.target.value;
                          setFormData({ ...formData, techStack: newItems });
                        }}
                        placeholder="Icon..."
                      />
                    </div>
                    <RenderIcon
                      icon={item.icon}
                      className="text-xl translate-y-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Process */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <h3 className="text-lg font-semibold text-white">Process</h3>
              <Button
                onClick={() =>
                  setFormData({
                    ...formData,
                    process: [
                      ...formData.process,
                      { title: "", description: "" },
                    ],
                  })
                }
                uiType="secondary"
                icon={<FaPlus size={12} />}
                label="Add Step"
                type="button"
                style={{ padding: "0.5rem 1rem" }}
              />
            </div>
            <div className="space-y-4">
              {formData.process.map((item, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg space-y-3 relative"
                >
                  <div className="absolute top-2 right-2">
                    <Button
                      onClick={() => {
                        const newItems = formData.process.filter(
                          (_, i) => i !== index
                        );
                        setFormData({ ...formData, process: newItems });
                      }}
                      uiType="text"
                      icon={<FaTrash size={12} />}
                      className="text-red-500"
                      type="button"
                      style={{ padding: "0.5rem 1rem" }}
                    />
                  </div>
                  <Input
                    label={`Step ${index + 1} Title`}
                    value={item.title}
                    onChange={(e) => {
                      const newItems = [...formData.process];
                      newItems[index].title = e.target.value;
                      setFormData({ ...formData, process: newItems });
                    }}
                    placeholder="e.g. Discovery"
                  />
                  <Textarea
                    label="Description"
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...formData.process];
                      newItems[index].description = e.target.value;
                      setFormData({ ...formData, process: newItems });
                    }}
                    placeholder="What happens in this step?"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section: FAQ */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <h3 className="text-lg font-semibold text-white">FAQ</h3>
              <Button
                onClick={() =>
                  setFormData({
                    ...formData,
                    faq: [...formData.faq, { question: "", answer: "" }],
                  })
                }
                uiType="secondary"
                icon={<FaPlus size={12} />}
                label="Add QA"
                type="button"
                style={{ padding: "0.5rem 1rem" }}
              />
            </div>
            <div className="space-y-4">
              {formData.faq.map((item, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg space-y-3 relative"
                >
                  <div className="absolute top-2 right-2">
                    <Button
                      onClick={() => {
                        const newItems = formData.faq.filter(
                          (_, i) => i !== index
                        );
                        setFormData({ ...formData, faq: newItems });
                      }}
                      uiType="text"
                      icon={<FaTrash size={12} />}
                      className="text-red-500"
                      type="button"
                    />
                  </div>
                  <Input
                    label="Question"
                    value={item.question}
                    onChange={(e) => {
                      const newItems = [...formData.faq];
                      newItems[index].question = e.target.value;
                      setFormData({ ...formData, faq: newItems });
                    }}
                    placeholder="e.g. How long does it take?"
                  />
                  <Textarea
                    label="Answer"
                    value={item.answer}
                    onChange={(e) => {
                      const newItems = [...formData.faq];
                      newItems[index].answer = e.target.value;
                      setFormData({ ...formData, faq: newItems });
                    }}
                    placeholder="Answer..."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section: CTA */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">
              Call To Action{" "}
              <span className="text-base text-zinc-400">
                (Override Default)
              </span>
            </h3>
            <Input
              value={formData.cta}
              onChange={(e) =>
                setFormData({ ...formData, cta: e.target.value })
              }
              placeholder="e.g. Schedule a Free Discovery Call"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 flex justify-end gap-3 sticky bottom-0 pb-4">
            <Button
              onClick={handleCloseModal}
              uiType="text"
              label="Cancel"
              type="button"
            />
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
                  : editingService
                  ? "Update Service"
                  : "Create Service"
              }
            />
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, type: null, id: null })}
        onConfirm={handleConfirmAction}
        title={
          confirmState.type === "delete"
            ? "Delete Service?"
            : confirmState.type === "discard"
            ? "Discard Changes?"
            : "Update Service?"
        }
        message={
          confirmState.type === "delete"
            ? "Are you sure you want to delete this service?"
            : confirmState.type === "discard"
            ? "You have unsaved changes. Are you sure you want to discard them?"
            : "Are you sure you want to update this service?"
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

export default Services;
