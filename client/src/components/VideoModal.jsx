import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { FaTimes } from "react-icons/fa";
import usePortfolioStore from "../store/usePortfolioStore";
import { cn } from "../utils/cn";

const VideoModal = ({ isOpen, onClose, video }) => {
  const { isRounded } = usePortfolioStore();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";

    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!video) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow Effect */}
            <div
              className="absolute -inset-4 bg-linear-to-r from-secondary/50 to-accent/50 opacity-30 blur-2xl -z-10 rounded-[inherit] transition-opacity duration-500"
            />

            {/* Gradient Border Wrapper */}
            <div
              className={cn(`relative w-full h-full p-px bg-linear-to-br from-white/20 via-white/5 to-white/10 ${
                isRounded ? "rounded-2xl" : "rounded-lg"
              } overflow-hidden`)}
            >
              {/* Inner Container */}
              <div
                className={cn(`relative w-full h-full bg-black/90 backdrop-blur-xl flex items-center justify-center overflow-hidden ${
                  isRounded ? "rounded-2xl" : "rounded-lg"
                }`)}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className={cn(`absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-500 text-white transition-all duration-300 backdrop-blur-md group ${
                    isRounded ? "rounded-full" : "rounded-lg"
                  }`)}
                >
                  <FaTimes className="group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {video.iframe ? (
                  <div
                    className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                    dangerouslySetInnerHTML={{ __html: video.src }}
                  />
                ) : (
                  <video
                    src={video.src}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default VideoModal;
