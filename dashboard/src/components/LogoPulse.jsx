import React from "react";
import { motion } from "framer-motion";

const LogoPulse = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative">
        {/* Outer pulsing ring */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-violet-500/30 blur-xl"
        />

        {/* Main Logo Circle */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/10"
        >
          <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-lg transform rotate-45" />
        </motion.div>
      </div>

      {/* Loading Text */}
      <div className="flex items-center gap-1">
        <span className="text-zinc-500 font-medium tracking-wider text-sm uppercase">
          Loading
        </span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          className="text-zinc-500"
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          className="text-zinc-500"
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          className="text-zinc-500"
        >
          .
        </motion.span>
      </div>
    </div>
  );
};

export default LogoPulse;
