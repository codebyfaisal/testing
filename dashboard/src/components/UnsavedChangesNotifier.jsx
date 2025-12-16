import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaExclamationTriangle, FaSpinner } from "react-icons/fa";

const UnsavedChangesNotifier = ({ isDirty, isSaving, error, onSave }) => {
  return (
    <AnimatePresence>
      {(isDirty || isSaving || error) && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border border-white/10 ${
              error ? "bg-red-500/90 text-white" : "bg-black/80 text-white"
            } min-w-[200px] justify-center transition-colors duration-300`}
          >
            {/* Status Icons */}
            <div className="flex items-center gap-2">
              {error ? (
                <FaExclamationTriangle className="text-white" />
              ) : isSaving ? (
                <FaSpinner className="animate-spin text-indigo-400" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              )}
            </div>

            {/* Message */}
            <div className="text-sm font-medium whitespace-nowrap">
              {error ? (
                <span>Please reload the page</span>
              ) : isSaving ? (
                <span>Saving changes...</span>
              ) : (
                <span>Unsaved changes</span>
              )}
            </div>

            {/* Action (Only if not saving/error) */}
            {!isSaving && !error && onSave && (
              <button
                onClick={onSave}
                className="ml-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold transition-colors"
                type="button"
              >
                Save
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UnsavedChangesNotifier;
