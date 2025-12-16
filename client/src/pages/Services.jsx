import React from "react";
import { motion } from "motion/react";
import usePortfolioStore from "../store/usePortfolioStore";
import { FaCode } from "react-icons/fa";
import { PageHeader, Plans, RenderIcon, SEO, Button } from "../components";
import { cn } from "../utils/cn";
import NotFound from "./NotFound";

import { Skeleton } from "../components/Skeleton";
import { siteConfig } from "../config/siteConfig";

const Services = () => {
  const { data, isRounded, loading } = usePortfolioStore();
  const servicesData = data?.services || [];
  const plans = data?.plans || [];
  const servicesConfig = siteConfig?.pages?.services;

  if (loading) {
    return (
      <div className="min-h-screen pt-5 overflow-hidden pb-20">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-0 md:max-w-7xl mx-auto">
          <PageHeader
            title={servicesConfig?.header?.title}
            description={servicesConfig?.header?.loadingDesc}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[400px] w-full rounded-3xl" />
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
        title="Services"
        description="Comprehensive professional services designed to meet your diverse needs. Web development, UI/UX design, and consultation."
        keywords={[
          "Services",
          "Web Development",
          "UI/UX",
          "Consultation",
          "Muhammad Faisal",
        ]}
      />
      <div className="px-4 sm:px-6 lg:px-8 xl:px-0 md:max-w-7xl mx-auto">
        <PageHeader
          title={servicesConfig?.header?.title}
          description={servicesConfig?.header?.description}
        />

        {servicesData.length === 0 ? (
          <NotFound
            title="No Services Found"
            description="We are currently updating our service offerings. Please feel free to contact us for specific inquiries."
            isFullPage={false}
            backgroundText="EMPTY"
            link="/contact"
            backTo="Contact Me"
            showBackgroundBubbles={false}
            className="my-10"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {servicesData.map((service, index) => {
              return (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn("relative group", isRounded && "rounded-3xl")}
                >
                  <div
                    className={cn(
                      "relative h-full bg-[#1a1a1a] p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-white/10 group-hover:border-white/20 shadow-blue/20",
                      isRounded && "rounded-3xl"
                    )}
                  >
                    {/* Icon Box */}
                    <div
                      className={cn(
                        "w-20 h-20 mb-6 flex items-center justify-center border-2 transition-transform duration-500 group-hover:rotate-6 bg-blue text-white",
                        isRounded && "rounded-3xl"
                      )}
                    >
                      {!service.icon || service.icon === "" ? (
                        <FaCode />
                      ) : (
                        <RenderIcon icon={service.icon} className="text-3xl" />
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-neutral-400 mb-8 text-sm leading-relaxed">
                      {service.description}
                    </p>

                    {/* Button */}
                    <Button
                      to={`/services/${service._id}`}
                      variant="primary"
                      className={cn("mt-auto uppercase tracking-wider text-sm")}
                    >
                      {servicesConfig?.button}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Web Development Plans Section */}
        {<Plans plans={plans} />}
      </div>
    </div>
  );
};

export default Services;
