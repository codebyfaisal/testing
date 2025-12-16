import React from "react";
import { motion } from "motion/react";
import { cn } from "../utils/cn";
import usePortfolioStore from "../store/usePortfolioStore";

const BentoItem = ({
  className,
  title,
  description,
  header,
  icon,
  children,
}) => {
  const { isRounded } = usePortfolioStore();
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative p-4 overflow-hidden bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between",
        isRounded ? "rounded-3xl" : "",
        className
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-black/5 to-transparent opacity-0 group-hover/bento:opacity-100 transition duration-500" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="overflow-hidden">{header}</div>

        <div className="mt-3 transition duration-200 space-y-2">
          {icon}
          <div className="font-sans font-bold text-white mb-2">{title}</div>
          <div className="font-sans font-normal text-zinc-400 text-sm leading-relaxed">
            {description}
          </div>
          {children}
        </div>
      </div>
    </motion.article>
  );
};

export default BentoItem;
