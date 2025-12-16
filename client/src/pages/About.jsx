import React from "react";
import usePortfolioStore from "../store/usePortfolioStore";
import { PageHeader, Testimonials, Button, SEO } from "../components";
import {
  FaFileDownload,
  FaGraduationCap,
  FaBriefcase,
  FaCode,
} from "react-icons/fa";
import { motion } from "motion/react";
import { cn } from "../utils/cn";
import { siteConfig } from "../config/siteConfig";
import { Skeleton } from "../components/Skeleton";

const About = () => {
  const aboutConfig = siteConfig?.pages?.about;
  const { isRounded, user, config, loading } = usePortfolioStore();

  const experience = user?.experience || [];
  const education = user?.education || [];
  const skills = user?.skills || [];

  if (loading) {
    return (
      <div className="pt-5 min-h-screen">
        <PageHeader
          title={{ start: "About", middle: "Me" }}
          description="Loading profile..."
        />
        <div className="max-w-7xl mx-auto px-6 pb-20 space-y-32">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center">
              <Skeleton className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] rounded-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-12 w-48 rounded-lg" />
            </div>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Skeleton className="h-8 w-48 mb-8" />
              <div className="space-y-8 pl-4 border-l border-white/10">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-8 w-48 mb-8" />
              <div className="space-y-8 pl-4 border-l border-white/10">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-5 min-h-screen">
      <SEO
        title={aboutConfig.seo.title}
        description={aboutConfig.seo.description}
        keywords={aboutConfig.seo.keywords}
      />
      <PageHeader
        title={{ ...aboutConfig.header }}
        description={aboutConfig.header.description}
      />

      <div className="max-w-7xl mx-auto px-6 pb-20 space-y-32">
        {/* Intro Section - Redesigned */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            {/* Organic/Bacteria styling */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px]">
              {/* Main Image Container */}
              <div
                className="w-full h-full overflow-hidden border-4 border-white/10 shadow-2xl relative z-10 bg-black/70"
                style={{
                  borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                  transition: "all 0.5s ease-in-out",
                }}
              >
                {config.about?.image || user?.aboutImage || user?.avatar ? (
                  <img
                    src={
                      config.about?.image || user?.aboutImage || user?.avatar
                    }
                    alt={
                      user?.name?.first
                        ? `Portrait of ${user.name.first}`
                        : "Portrait of Muhammad Faisal"
                    }
                    className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-black/70 flex items-center justify-center text-text-secondary">
                    No Image
                  </div>
                )}
              </div>

              {/* Decorative Blobs */}
              <div
                className="absolute inset-0 border-2 border-secondary/30 -z-10 translate-x-4 translate-y-4"
                style={{ borderRadius: "50% 50% 20% 80% / 25% 80% 20% 75%" }}
              />
              <div
                className="absolute inset-0 bg-secondary/5 blur-3xl -z-20 scale-110"
                style={{ borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              {config.about?.title || (
                <>
                  Hello, I'm{" "}
                  <span className="text-secondary">{user?.name?.first}</span>
                </>
              )}
            </h2>
            <div className="text-text-secondary text-lg leading-relaxed space-y-4">
              <p>{config.about?.description || user?.bio}</p>
            </div>

            {user?.resume && (
              <div className="pt-4">
                <Button
                  href={user.resume}
                  variant="white"
                  className="gap-2 shadow-lg hover:shadow-white/10"
                  padding="px-8 py-4"
                  icon={FaFileDownload}
                >
                  {aboutConfig?.buttons?.resume}
                </Button>
              </div>
            )}
          </motion.div>
        </section>

        {/* Experience & Education */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <FaBriefcase className="text-secondary" />{" "}
              {aboutConfig?.sections?.experience}
            </h3>
            <div className="space-y-8 pl-4 border-l border-white/10">
              {experience.map((exp, index) => (
                <div key={index} className="relative pl-8">
                  <div className="absolute top-1.5 -left-[22px] w-3 h-3 rounded-full bg-secondary border-4 border-primary" />
                  <h4 className="text-xl font-bold text-white">{exp.role}</h4>
                  <p className="text-secondary mb-2">{exp.company}</p>
                  <p className="text-text-secondary text-sm mb-4">
                    {new Date(exp.startDate).getFullYear()} -{" "}
                    {exp.current
                      ? "Present"
                      : new Date(exp.endDate).getFullYear()}
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
              {experience.length === 0 && (
                <p className="text-text-secondary">
                  {aboutConfig?.emptyStates?.experience}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <FaGraduationCap className="text-accent" />{" "}
              {aboutConfig?.sections?.education}
            </h3>
            <div className="space-y-8 pl-4 border-l border-white/10">
              {education.map((edu, index) => (
                <div key={index} className="relative pl-8">
                  <div className="absolute top-1.5 -left-[22px] w-3 h-3 rounded-full bg-accent border-4 border-primary" />
                  <h4 className="text-xl font-bold text-white">{edu.degree}</h4>
                  <p className="text-accent mb-2">
                    {edu.institution}, {edu.location}
                  </p>
                  <p className="text-text-secondary text-sm mb-4">
                    {new Date(edu.startDate).getFullYear()} -{" "}
                    {edu.current
                      ? "Present"
                      : new Date(edu.endDate).getFullYear()}
                  </p>
                </div>
              ))}
              {education.length === 0 && (
                <p className="text-text-secondary">
                  {aboutConfig?.emptyStates?.education}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section>
          <h3 className="text-2xl font-bold text-white mb-10 flex items-center gap-3 justify-center">
            <FaCode className="text-secondary" />{" "}
            {aboutConfig?.sections?.skills}
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {skills.map((skill, index) => (
              <div
                key={index}
                className={cn(
                  "px-6 py-2 bg-black/70 border border-white/10 flex items-center gap-3 hover:border-secondary/50 hover:bg-secondary/10 transition-colors",
                  isRounded ? "rounded-xl" : "rounded-lg"
                )}
              >
                {skill.icon &&
                  (skill.icon.includes("svg") ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: skill.icon }}
                      className="w-6 h-6 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-white [&>svg]:opacity-70"
                    />
                  ) : (
                    <img
                      src={skill.icon}
                      alt=""
                      className="w-6 h-6 invert opacity-70"
                    />
                  ))}
                <span className="text-white font-medium">{skill.name}</span>
              </div>
            ))}
            {skills.length === 0 && (
              <p className="text-text-secondary">
                {aboutConfig?.emptyStates?.skills}
              </p>
            )}
          </div>
        </section>

        <Testimonials />
      </div>
    </div>
  );
};

export default About;
