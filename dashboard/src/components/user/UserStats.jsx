import React from "react";
import { motion } from "motion/react";
import { FaBriefcase, FaProjectDiagram, FaSmile } from "react-icons/fa";
import { Input } from "../../components";

const UserStats = ({ formData, handleChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
    >
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <FaBriefcase className="text-indigo-500" /> Professional Stats
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Input
          type="number"
          name="yearOfExperience"
          value={formData.yearOfExperience}
          onChange={handleChange}
          label={
            <span className="flex items-center gap-2">
              <FaBriefcase className="text-zinc-500" /> Experience (Years)
            </span>
          }
        />
        <Input
          type="number"
          name="projectsCompleted"
          value={formData.projectsCompleted}
          onChange={handleChange}
          label={
            <span className="flex items-center gap-2">
              <FaProjectDiagram className="text-zinc-500" /> Projects Completed
            </span>
          }
        />
        <Input
          type="number"
          name="happyClients"
          value={formData.happyClients}
          onChange={handleChange}
          label={
            <span className="flex items-center gap-2">
              <FaSmile className="text-zinc-500" /> Happy Clients
            </span>
          }
        />
      </div>
    </motion.div>
  );
};

export default UserStats;
