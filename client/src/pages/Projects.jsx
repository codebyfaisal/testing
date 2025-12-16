import React from "react";
import { motion } from "motion/react";
import usePortfolioStore from "../store/usePortfolioStore";
import { FaGithub, FaExternalLinkAlt, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { PageHeader, Plans, SEO, Button } from "../components";
import { cn } from "../utils/cn";
import NotFound from "./NotFound";
import { Skeleton } from "../components/Skeleton";
import { siteConfig } from "../config/siteConfig";

const Projects = () => {
  const { data, isRounded, loading } = usePortfolioStore();
  const projectsData = data?.projects || [];
  const plans = data?.plans || [];
  const projectsConfig = siteConfig?.pages?.projects;

  if (loading) {
    return (
      <div className="min-h-screen pt-5 overflow-hidden pb-20">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-0 md:max-w-7xl mx-auto">
          <PageHeader
            title={projectsConfig?.header?.title}
            description={projectsConfig?.header?.loadingDesc}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[400px] w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen pt-5 overflow-hidden pb-20">
      <SEO
        title="Projects"
        description="A showcase of Muhammad Faisal's recent work, featuring full-stack applications, creative frontend designs, and technical achievements."
        keywords={[
          "Projects",
          "Portfolio",
          "Case Studies",
          "Web Apps",
          "React",
        ]}
      />
      <div className="px-4 sm:px-6 lg:px-8 xl:px-0 md:max-w-7xl mx-auto">
        <PageHeader
          title={projectsConfig?.header?.title}
          description={projectsConfig?.header?.description}
        />

        {!projectsData || projectsData.length === 0 ? (
          <NotFound
            title="No Projects Found"
            description="I'm currently working on some exciting new projects. Check back soon!"
            isFullPage={false}
            backgroundText="EMPTY"
            link="/"
            backTo="Go Home"
            showBackgroundBubbles={false}
            className="my-10"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projectsData.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "group relative h-[400px] overflow-hidden border border-white/10",
                  isRounded && "rounded-2xl"
                )}
              >
                {/* Background Image */}
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-white/5 via-transparent to-black opacity-80" />

                {/* Hover Overlay for Links */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                  <Button
                    href={project.githubLink || "#"}
                    variant="white"
                    className="gap-2"
                    icon={FaGithub}
                  >
                    {projectsConfig?.buttons?.code}
                  </Button>
                  <Button
                    href={project.liveLink}
                    variant="primary"
                    className="gap-2"
                    icon={FaExternalLinkAlt}
                  >
                    {projectsConfig?.buttons?.live}
                  </Button>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {project.title}
                  </h3>
                  <Link
                    to={`/projects/${project._id}`}
                    className="inline-flex items-center gap-2 text-secondary font-bold hover:text-white transition opacity-0 group-hover:opacity-100 duration-300 delay-100"
                  >
                    {projectsConfig?.buttons?.details} <FaArrowRight />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Web Development Plans Section */}
        {plans && plans.length > 0 && <Plans plans={plans} />}
      </div>
    </div>
  );
};

export default Projects;
