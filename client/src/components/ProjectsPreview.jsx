import React from "react";
import { FaProjectDiagram, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { cn } from "../utils/cn";
import usePortfolioStore from "../store/usePortfolioStore";
import { Skeleton } from "./Skeleton";
import { motion } from "motion/react";
import { siteConfig } from "../config/siteConfig";

const ProjectCard = ({ project, className }) => {
  return (
    <article className={cn("h-full", className)}>
      <Link
        to={`/projects/${project._id}`}
        className="group/card relative block h-full overflow-hidden"
      >
        {/* Background Image */}
        {project.images && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/card:scale-110"
            style={{ backgroundImage: `url(${project.images[0]})` }}
          >
            <div className="absolute inset-0 bg-black/60 group-hover/card:bg-black/40 transition-colors duration-500" />
          </div>
        )}
        {!project.images && (
          <div className="absolute inset-0 bg-zinc-900 group-hover/card:bg-zinc-800 transition-colors" />
        )}

        <div className="relative z-10 h-full p-6 flex flex-col justify-end">
          <div className="mb-auto opacity-0 group-hover/card:opacity-100 transition-opacity transform -translate-y-2 group-hover/card:translate-y-0 duration-300">
            <span className="inline-block px-2 py-1 text-xs font-bold bg-white text-black rounded-full mb-2">
              {siteConfig?.pages?.home?.universe?.projects?.viewProject}
            </span>
          </div>

          <div>
            <h4 className="text-2xl font-bold text-white mb-2 group-hover/card:text-secondary transition-colors">
              {project.title}
            </h4>
            <p className="text-sm text-neutral-300 line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
};

const ComingSoonCard = ({ className }) => {
  return (
    <div
      className={cn(
        "relative h-full bg-zinc-900/50 flex flex-col items-center justify-center text-center p-6",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-zinc-600">
        <FaLock size={24} />
      </div>
      <h4 className="text-xl font-bold text-zinc-500 mb-2">
        {siteConfig?.pages?.home?.universe?.projects?.comingSoon?.title}
      </h4>
      <p className="text-xs text-zinc-600 max-w-[200px]">
        {siteConfig?.pages?.home?.universe?.projects?.comingSoon?.description}
      </p>

      {/* Abstract Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

const ProjectsPreview = ({ className }) => {
  const { data, loading } = usePortfolioStore();

  if (loading) {
    return (
      <div
        className={cn(
          "overflow-hidden bg-[#0a0a0a] border border-white/10 flex flex-col",
          className
        )}
      >
        <div className="flex-1 p-4 border-b border-white/10">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
        <div className="flex-1 p-4">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
      </div>
    );
  }

  const projects = data?.projects || [];
  const displayProjects = projects.slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative overflow-hidden bg-black border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col",
        className
      )}
    >
      <div className="flex flex-col md:flex-row h-full divide-y md:divide-y-0 md:divide-x divide-white/10">
        {/* First Project */}
        <div className="flex-1 h-full relative min-h-[50%] md:min-h-full">
          {displayProjects[0] ? (
            <ProjectCard project={displayProjects[0]} className="h-full" />
          ) : (
            <ComingSoonCard className="h-full" />
          )}
        </div>

        {/* Second Project or Placeholder */}
        <div className="flex-1 h-full relative min-h-[50%] md:min-h-full">
          {displayProjects[1] ? (
            <ProjectCard project={displayProjects[1]} className="h-full" />
          ) : (
            <ComingSoonCard className="h-full" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectsPreview;
