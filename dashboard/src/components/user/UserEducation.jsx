import React, { useState } from "react";

import { FaUser, FaPlus, FaTrash } from "react-icons/fa";
import { Input, Button, Modal, Card } from "@/components";

const UserEducation = ({ formData, setFormData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEducation, setNewEducation] = useState({
    institution: "",
    location: "",
    degree: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const handleAddEducation = (e) => {
    e.preventDefault();
    if (
      newEducation.institution &&
      newEducation.location &&
      newEducation.degree &&
      newEducation.startDate &&
      (newEducation.endDate || newEducation.current) &&
      newEducation.description
    ) {
      setFormData((prev) => ({
        ...prev,
        education: [...prev.education, newEducation],
      }));
      setNewEducation({
        institution: "",
        location: "",
        degree: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      });
      setIsModalOpen(false);
    }
  };

  const handleRemoveEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <FaUser className="text-primary" /> Education
        </h3>
        <Button
          onClick={() => setIsModalOpen(true)}
          uiType="primary"
          icon={<FaPlus size={12} />}
          label="Add Education"
        />
      </div>

      {/* List Education */}
      <div className="space-y-4">
        {formData.education.map((edu, index) => (
          <Card
            key={index}
            className="bg-muted/30 relative group"
            padding="p-4"
          >
            <Button
              onClick={() => handleRemoveEducation(index)}
              uiType="text"
              icon={<FaTrash />}
              className="absolute top-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 w-auto group-hover:hover:text-destructive"
            />
            <h4 className="font-bold text-foreground">{edu.degree}</h4>
            <p className="text-primary text-sm">
              {edu.institution}, {edu.location}
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              {new Date(edu.startDate).toLocaleDateString()} -{" "}
              {edu.current
                ? "Present"
                : new Date(edu.endDate).toLocaleDateString()}
            </p>
            {edu.description && (
              <p className="text-muted-foreground text-sm mt-2">
                {edu.description}
              </p>
            )}
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Education"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Institution"
              value={newEducation.institution}
              onChange={(e) =>
                setNewEducation({
                  ...newEducation,
                  institution: e.target.value,
                })
              }
            />
            <Input
              label="Location"
              value={newEducation.location}
              onChange={(e) =>
                setNewEducation({
                  ...newEducation,
                  location: e.target.value,
                })
              }
            />
            <Input
              label="Degree"
              value={newEducation.degree}
              onChange={(e) =>
                setNewEducation({
                  ...newEducation,
                  degree: e.target.value,
                })
              }
            />
            <Input
              label="Start Date"
              type="date"
              value={newEducation.startDate}
              onChange={(e) =>
                setNewEducation({
                  ...newEducation,
                  startDate: e.target.value,
                })
              }
            />
            <Input
              label="End Date"
              type="date"
              value={newEducation.endDate}
              onChange={(e) =>
                setNewEducation({
                  ...newEducation,
                  endDate: e.target.value,
                })
              }
              disabled={newEducation.current}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="currentEducation"
              checked={newEducation.current}
              onChange={(e) =>
                setNewEducation({
                  ...newEducation,
                  current: e.target.checked,
                })
              }
              className="rounded border-border bg-muted text-primary focus:ring-primary"
            />
            <label
              htmlFor="currentEducation"
              className="text-sm text-muted-foreground"
            >
              I am currently studying here
            </label>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Description
            </label>
            <textarea
              value={newEducation.description}
              onChange={(e) =>
                setNewEducation({
                  ...newEducation,
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
              onClick={handleAddEducation}
              uiType="primary"
              label="Add Education"
            />
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default UserEducation;
