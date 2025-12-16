import React, { useState } from "react";
import { motion } from "motion/react";
import { FaCode, FaPlus } from "react-icons/fa";
import { Input, Button, RenderIcon } from "../../components";

const UserSkills = ({ formData, setFormData }) => {
  const [newSkill, setNewSkill] = useState({
    name: "",
    icon: "",
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
        skills: [...prev.skills, { ...newSkill, name: newSkill.name.trim() }],
      }));
      setNewSkill({ name: "", icon: "", isTechStack: false });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.name !== skillToRemove.name),
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
    >
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <FaCode className="text-indigo-500" /> Skills
      </h3>
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
            <div className="relative grid grid-cols-12 gap-2">
              <Input
                label="Skill Name"
                value={newSkill.name}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, name: e.target.value })
                }
                placeholder="Skill Name (e.g. React)"
                className="col-span-11"
              />
              <RenderIcon
                icon={newSkill.icon}
                className="col-span-1 translate-y-[15%]"
              />
            </div>
            <Input
              label="Icon (choose icons from Iconify OR SimpleIcons)"
              value={newSkill.icon}
              onChange={(e) =>
                setNewSkill({ ...newSkill, icon: e.target.value })
              }
              placeholder="SVG or Icon URL or Icon Name or Please read the documentation"
            />
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
                  className="rounded border-zinc-800 bg-zinc-900 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isTechStack" className="text-sm text-zinc-400">
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
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded-lg text-sm flex items-center gap-3 border transition-colors ${
                  skill.isTechStack
                    ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                    : "bg-zinc-800/50 text-zinc-400 border-zinc-700/50"
                }`}
              >
                <span className="text-lg">
                  <RenderIcon icon={skill.icon} />
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
                  className="ml-1 hover:text-red-400 transition-colors w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/5"
                >
                  &times;
                </button>
              </div>
            ))}
            {formData.skills.length === 0 && (
              <p className="text-zinc-500 text-sm italic w-full text-center py-4">
                No skills added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserSkills;
