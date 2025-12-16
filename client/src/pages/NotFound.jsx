import React from "react";
import { motion } from "motion/react";
import { FaHome } from "react-icons/fa";
import { Button } from "../components/Button";
import SEO from "../components/SEO";
import { cn } from "../utils/cn";

const NotFound = ({
  title = "Page Not Found",
  description = "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
  link = "/",
  icon = <FaHome />,
  backTo = "Back to Home",
  isFullPage = true,
  backgroundText = "404",
  className = "",
  showBackgroundBubbles = true,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center p-4 overflow-hidden relative",
        isFullPage
          ? "min-h-screen bg-black"
          : "w-full min-h-[50vh] rounded-3xl border border-white/5 bg-white/5",
        className
      )}
    >
      {isFullPage && <SEO title={title} description={description} />}

      {/* Background Elements */}
      {showBackgroundBubbles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
        </div>
      )}

      <div className="text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <h1 className="text-[100px] md:text-[200px] font-bold text-white/5 leading-none select-none">
            {backgroundText}
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl md:text-4xl font-bold text-white max-w-lg px-4">
              {title}
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-neutral-400 text-base md:text-lg max-w-md mx-auto mb-8"
        >
          {description}
        </motion.p>

        {link && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button to={link} variant="white" size="lg" className="gap-2">
              {icon} {backTo}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotFound;
