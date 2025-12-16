import React from "react";
import { motion } from "motion/react";
import { cn } from "../utils/cn";

const BentoGrid = ({ className, children }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className={cn(
        "flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-5 gap-4 max-w-7xl mx-auto md:auto-rows-[100px]",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default BentoGrid;
