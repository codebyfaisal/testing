import React from "react";
import { motion } from "motion/react";
import { FaReact, FaNodeJs, FaHtml5, FaCss3, FaJs } from "react-icons/fa";
import { SiTailwindcss, SiTypescript, SiNextdotjs } from "react-icons/si";
import usePortfolioStore from "../store/usePortfolioStore";
import RenderIcon from "./RenderIcon";

// 1. Tech Stack Scatter Visual
const TechScatter = () => {
  const { user } = usePortfolioStore();
  const techStack = user?.skills;
  if (!techStack) return null;

  return (
    <div className="relative w-full h-full min-h-[160px] bg-black/20 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient from-primary/10 to-transparent opacity-50" />

      {techStack.map((stack, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.5, type: "spring" }}
          className="absolute flex items-center justify-center p-3 bg-black/80 border border-white/10 rounded-2xl shadow-lg backdrop-blur-sm hover:scale-110 transition-transform duration-300"
        >
          <RenderIcon icon={stack.icon} className="[&>svg]:text-2xl" />
        </motion.div>
      ))}
    </div>
  );
};

// 2. Dashboard/Service Visual
const DashboardPreview = () => {
  return (
    <div className="relative w-full h-full min-h-[220px] p-6 flex items-center justify-center bg-black/20 rounded-xl overflow-hidden">
      {/* Abstract UI Window */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[200px] bg-neutral-900 border border-white/10 rounded-lg shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="h-6 bg-white/5 border-b border-white/5 flex items-center px-2 gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
        {/* Body */}
        <div className="p-3 space-y-2">
          <div className="flex gap-2">
            <div className="w-1/3 h-16 bg-primary/10 rounded-md border border-primary/20" />
            <div className="w-2/3 h-16 bg-white/5 rounded-md" />
          </div>
          <div className="h-2 bg-white/10 rounded-full w-3/4" />
          <div className="h-2 bg-white/10 rounded-full w-1/2" />
        </div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 right-8 w-10 h-10 bg-secondary/20 rounded-lg border border-secondary/30 backdrop-blur-md flex items-center justify-center"
      >
        <div className="w-4 h-4 bg-secondary rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
      </motion.div>
    </div>
  );
};

// 4. Contact/Social Visual
const SocialHologram = () => {
  return (
    <div className="relative w-full h-full min-h-[160px] flex items-center justify-center bg-black/20 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent" />

      <div className="relative grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-secondary hover:text-black transition-colors duration-300 cursor-pointer"
          >
            <div className="w-4 h-4 rounded-full bg-current opacity-50" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// 5. Plans/Pricing Visual
const PlansPreview = () => {
  return (
    <div className="relative w-full h-full min-h-[160px] flex items-center justify-center bg-black/20 rounded-xl overflow-hidden">
      <div className="flex gap-3 items-end">
        {/* Basic Plan Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-24 h-24 bg-white/5 border border-white/10 rounded-lg p-2 flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white/20" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-12 bg-white/20 rounded-full" />
            <div className="h-1.5 w-8 bg-white/10 rounded-full" />
          </div>
        </motion.div>

        {/* Pro Plan Card (Highlighted) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-28 h-32 bg-secondary/10 border border-secondary/30 rounded-lg p-3 flex flex-col justify-between relative shadow-[0_0_15px_rgba(74,222,128,0.1)]"
        >
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-black text-[10px] font-bold">
            ★
          </div>
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-secondary" />
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-16 bg-white/40 rounded-full" />
            <div className="h-2 w-10 bg-white/20 rounded-full" />
            <div className="h-2 w-12 bg-white/20 rounded-full" />
          </div>
        </motion.div>

        {/* Enterprise Plan Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-24 h-24 bg-white/5 border border-white/10 rounded-lg p-2 flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white/20" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-12 bg-white/20 rounded-full" />
            <div className="h-1.5 w-8 bg-white/10 rounded-full" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// 6. Generic Service Visual
const ServicePreview = ({ image }) => {
  return (
    <div className="relative w-full h-full min-h-[160px] flex items-center justify-center bg-black/20 rounded-xl overflow-hidden group">
      {image ? (
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <div className="absolute inset-0 bg-black/20 z-10" />
          <img
            src={image}
            alt="Service"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </motion.div>
      ) : (
        <>
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-purple-500/5" />

          {/* Abstract Shapes */}
          <div className="relative z-10 grid grid-cols-2 gap-3 p-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-16 h-24 bg-white/5 rounded-lg border border-white/10 overflow-hidden"
            >
              <div className="h-full w-full bg-linear-to-b from-white/5 to-transparent" />
            </motion.div>
            <div className="space-y-3 pt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-12 h-12 bg-secondary/10 rounded-lg border border-secondary/20 flex items-center justify-center"
              >
                <div className="w-6 h-6 rounded-full bg-secondary/40" />
              </motion.div>
              <div className="w-16 h-2 bg-white/10 rounded-full" />
              <div className="w-10 h-2 bg-white/10 rounded-full" />
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />
        </>
      )}
    </div>
  );
};

export {
  TechScatter,
  DashboardPreview,
  SocialHologram,
  PlansPreview,
  ServicePreview,
};
