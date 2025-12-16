import React from "react";
import { motion } from "motion/react";
import usePortfolioStore from "../store/usePortfolioStore";
import { cn } from "../utils/cn";

const defaultTitle = { start: "", middle: "", end: "" };

const PageHeader = ({ title = defaultTitle, description = "" }) => {
  const { data, isRounded } = usePortfolioStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-20"
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
        {title.start} <span className="text-secondary">{title.middle}</span>{" "}
        {title.end}
      </h1>
      <div
        className={cn(
          `w-24 h-1 bg-secondary mx-auto`,
          isRounded && "rounded-full"
        )}
      />
      {description && <p className="max-w-3xl mx-auto mt-4">{description}</p>}
    </motion.div>
  );
};

export default PageHeader;
