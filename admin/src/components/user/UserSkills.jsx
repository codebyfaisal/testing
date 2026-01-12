import React, { useState } from "react";
import { FaCode, FaPlus } from "react-icons/fa";
import { Input, Button, RenderIcon, Card } from "@/components";
import defaultIcons from "@/defaultIcons";

const UserSkills = ({ formData, setFormData, className = "" }) => {
  const [newSkill, setNewSkill] = useState({
    name: "",
    icon: defaultIcons.techStack,
    isTechStack: false,
  });

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (
      newSkill.name.trim() &&
      !formData.skills.some((s) => s.name === newSkill.name.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        skills: [
          ...prev.skills,
          {
            ...newSkill,
            name: newSkill.name.trim(),
            icon: newSkill.icon.trim() || defaultIcons.techStack,
          },
        ],
      }));
      setNewSkill({
        name: "",
        icon: defaultIcons.techStack,
        isTechStack: false,
      });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.name !== skillToRemove.name),
    }));
  };

  return (
    <Card className={className}>
      <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
        <FaCode className="text-primary" /> Skills
      </h3>
      <div className="space-y-4">
        <div className="space-y-4">
          <Card
            className="flex flex-col gap-4 bg-muted/30"
            padding="p-4"
          >
            <Input
              label="Skill Name"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
              placeholder="Skill Name (e.g. React)"
              className="col-span-11"
            />
            <div className="relative grid grid-cols-12 gap-2">
              <Input
                label="Icon (choose icons from Iconify OR SimpleIcons)"
                value={newSkill.icon}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, icon: e.target.value })
                }
                placeholder="SVG or Icon URL or Icon Name or Please read the documentation"
                className="col-span-10"
              />
              <RenderIcon
                icon={newSkill.icon}
                className="col-span-2 translate-y-[15%]"
                defaultIcon={defaultIcons.techStack}
              />
            </div>
            <div className="flex gap-2">
              <a
                href={"https://simpleicons.org/"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                SimpleIcons
              </a>
              <a
                href={"https://icon-sets.iconify.design/"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                Iconify
              </a>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isTechStack"
                  checked={newSkill.isTechStack}
                  onChange={(e) =>
                    setNewSkill({
                      ...newSkill,
                      isTechStack: e.target.checked,
                    })
                  }
                  className="rounded border-border bg-muted text-primary focus:ring-primary"
                />
                <label
                  htmlFor="isTechStack"
                  className="text-sm text-muted-foreground"
                >
                  Show in Tech Stack
                </label>
              </div>
              <Button
                onClick={handleAddSkill}
                type="primary"
                icon={<FaPlus size={12} />}
                label="Add Skill"
                disabled={!newSkill.name}
              />
            </div>
          </Card>

          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <Card
                key={index}
                className={`px-3 py-2 text-sm flex items-center gap-3 transition-colors ${
                  skill.isTechStack
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-muted/50 text-muted-foreground"
                }`}
                rounded="rounded-2xl"
                padding="p-0"
              >
                <span className="text-lg">
                  <RenderIcon
                    icon={skill.icon}
                    defaultIcon={defaultIcons.techStack}
                  />
                </span>
                <div className="flex flex-col">
                  <span className="font-medium leading-none">{skill.name}</span>
                  {skill.isTechStack && (
                    <span className="text-[10px] opacity-70 mt-0.5">
                      Tech Stack
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  type="button"
                  className="ml-1 hover:text-destructive transition-colors w-5 h-5 flex items-center justify-center rounded-full hover:bg-muted"
                >
                  &times;
                </button>
              </Card>
            ))}
            {formData.skills.length === 0 && (
              <p className="text-muted-foreground text-sm italic w-full text-center py-4">
                No skills added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserSkills;
