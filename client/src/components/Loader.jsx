import React from "react";
import { motion } from "motion/react";

const Loader = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white z-50 fixed inset-0">
      <div className="relative w-24 h-24 mb-8">
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 border-4 border-white/20 rounded-full"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Spinning Ring */}
        <motion.div
          className="absolute inset-0 border-4 border-t-secondary border-r-transparent border-b-transparent border-l-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner Pulse */}
        <motion.div
          className="absolute inset-4 bg-secondary/20 rounded-full blur-md"
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="text-xl font-bold tracking-[0.2em] text-white/80 uppercase"
      >
        Loading
      </motion.div>
    </div>
  );
};

export default Loader;
