import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import usePortfolioStore from "../store/usePortfolioStore";
import {
  FaArrowLeft,
  FaGithub,
  FaExternalLinkAlt,
  FaProjectDiagram,
} from "react-icons/fa";
import { Plans, SEO, Button, Skeleton, ImageSlider } from "../components";
import { cn } from "../utils/cn";
import NotFound from "./NotFound";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const ProjectDetail = () => {
  const { id } = useParams();
  const { data, isRounded, loading } = usePortfolioStore();
  const project = data?.projects?.find((p) => p._id.toString() === id);
  const plans = project?.services?.plans;

  if (loading) {
    return (
      <div className="min-h-screen pt-5 overflow-hidden pb-20">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-0 md:max-w-7xl mx-auto">
          <Skeleton className="w-32 h-6 mb-8" />

          {/* Hero Image */}
          <Skeleton
            className={`w-full h-[400px] md:h-[500px] mb-8 ${
              isRounded ? "rounded-3xl" : ""
            }`}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <div>
                <Skeleton className="h-8 w-40 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>

              {/* Features */}
              <div>
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-5 w-full" />
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Links Card */}
              <div
                className={`p-6 border border-white/10 bg-white/5 space-y-6 ${
                  isRounded ? "rounded-2xl" : ""
                }`}
              >
                <Skeleton className="h-6 w-32" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>

              {/* Back Button */}
              <div
                className={`p-6 border border-white/10 bg-white/5 ${
                  isRounded ? "rounded-2xl" : ""
                }`}
              >
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  if (!project)
    return (
      <NotFound
        title="Project Not Found"
        description="The project you are looking for might have been removed, had its URL changed, or is temporarily unavailable."
        link="/projects"
        icon={<FaProjectDiagram />}
        backTo="Back to Projects"
      />
    );

  return (
    <div className="min-h-screen pt-5 overflow-hidden pb-20">
      <SEO
        title={project?.title}
        description={project?.description}
        image={project?.image}
        keywords={project?.techStack}
      />
      <div className="px-4 sm:px-6 lg:px-8 xl:px-0 md:max-w-7xl mx-auto">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-white hover:text-secondary mb-8 transition"
        >
          <FaArrowLeft /> Back to Projects
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className={cn(
              "relative h-[400px] md:h-[500px] w-full overflow-hidden mb-8",
              isRounded && "rounded-3xl"
            )}
          >
            <ImageSlider
              images={
                project?.images?.length > 0 ? project.images : [project?.image]
              }
              title={project?.title}
              isRounded={isRounded}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                {project?.title}
              </h1>
              {project?.date && (
                <p className="text-neutral-300 text-lg mb-4 flex items-center gap-2">
                  <span>{formatDate(project.date.start)}</span>
                  <span>-</span>
                  <span>
                    {project.date.ongoing
                      ? "Present"
                      : formatDate(project.date.end)}
                  </span>
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                {project?.techStack?.map((tech) => (
                  <span
                    key={tech}
                    className={cn(
                      "px-3 py-1 text-sm bg-white/10 text-white backdrop-blur-md border border-white/10",
                      isRounded && "rounded-full"
                    )}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-xl text-neutral-300 leading-relaxed mb-8">
                {project?.description}
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">
                Key Features
              </h2>
              <ul className="list-disc list-inside text-neutral-300 space-y-2 mb-8">
                {project?.features?.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-1">
              <div
                className={cn(
                  "bg-white/5 p-6 border border-white/10",
                  isRounded && "rounded-2xl"
                )}
              >
                <h3 className="text-xl font-bold text-white mb-6">
                  Project Links
                </h3>
                <div className="space-y-4">
                  <Button
                    href={project?.liveLink}
                    variant="primary"
                    className="w-full"
                    icon={FaExternalLinkAlt}
                  >
                    Live Demo
                  </Button>
                  <Button
                    href={project?.githubLink || "#"}
                    variant="secondary"
                    className="w-full"
                    icon={FaGithub}
                  >
                    View Code
                  </Button>
                </div>
              </div>
              <div
                className={cn(
                  "bg-white/5 p-6 mt-6 border border-white/10",
                  isRounded && "rounded-2xl"
                )}
              >
                <Button
                  to="/projects"
                  variant="secondary"
                  className="w-full"
                  icon={FaArrowLeft}
                >
                  Back to Projects
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Web Development Plans Section */}
        {data.services.find((s) => s._id === "web-dev") && (
          <Plans
            plans={data.services.find((s) => s._id === "web-dev").plans}
            title="Web Development Plans"
            theme="fuchsia"
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
