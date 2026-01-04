import React, { useState } from "react";
import { FaBriefcase, FaPlus, FaTrash } from "react-icons/fa";
import { Input, Button, Modal, Card } from "@/components";

const UserExperience = ({ formData, setFormData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExperience, setNewExperience] = useState({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const handleAddExperience = (e) => {
    e.preventDefault();
    if (
      newExperience.company &&
      newExperience.role &&
      newExperience.startDate &&
      (newExperience.endDate || newExperience.current) &&
      newExperience.description
    ) {
      setFormData((prev) => ({
        ...prev,
        experience: [...prev.experience, newExperience],
      }));
      setNewExperience({
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      });
      setIsModalOpen(false);
    }
  };

  const handleRemoveExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <FaBriefcase className="text-primary" /> Work Experience
        </h3>
        <Button
          onClick={() => setIsModalOpen(true)}
          uiType="primary"
          icon={<FaPlus size={12} />}
          label="Add Experience"
        />
      </div>

      {/* List Experience */}
      <div className="space-y-4">
        {formData.experience.map((exp, index) => (
          <Card
            key={index}
            className="bg-muted/30 relative group"
            padding="p-4"
          >
            <Button
              onClick={() => handleRemoveExperience(index)}
              uiType="text"
              icon={<FaTrash />}
              className="absolute top-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 w-auto group-hover:hover:text-destructive"
            />
            <h4 className="font-bold text-foreground">{exp.role}</h4>
            <p className="text-primary text-sm">{exp.company}</p>
            <p className="text-muted-foreground text-xs mt-1">
              {new Date(exp.startDate).toLocaleDateString()} -{" "}
              {exp.current
                ? "Present"
                : new Date(exp.endDate).toLocaleDateString()}
            </p>
            {exp.description && (
              <p className="text-muted-foreground text-sm mt-2">
                {exp.description}
              </p>
            )}
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Work Experience"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company"
              value={newExperience.company}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  company: e.target.value,
                })
              }
            />
            <Input
              label="Role"
              value={newExperience.role}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  role: e.target.value,
                })
              }
            />
            <Input
              label="Start Date"
              type="date"
              value={newExperience.startDate}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  startDate: e.target.value,
                })
              }
            />
            <Input
              label="End Date"
              type="date"
              value={newExperience.endDate}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  endDate: e.target.value,
                })
              }
              disabled={newExperience.current}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="currentRole"
              checked={newExperience.current}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  current: e.target.checked,
                })
              }
              className="rounded border-border bg-muted text-primary focus:ring-primary"
            />
            <label
              htmlFor="currentRole"
              className="text-sm text-muted-foreground"
            >
              I currently work here
            </label>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Description
            </label>
            <textarea
              value={newExperience.description}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  description: e.target.value,
                })
              }
              rows={3}
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors resize-none placeholder-muted-foreground"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={() => setIsModalOpen(false)}
              uiType="text"
              label="Cancel"
            />
            <Button
              onClick={handleAddExperience}
              uiType="primary"
              label="Add Experience"
            />
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default UserExperience;
