import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import usePortfolioStore from "../store/usePortfolioStore";
import {
  FaArrowLeft,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { Plans, RenderIcon, SEO, CTA } from "../components";

const ServiceDetail = () => {
  const { id } = useParams();
  const { data, isRounded, loading } = usePortfolioStore();

  if (loading) {
    return (
      <div className="min-h-screen pt-5 overflow-hidden pb-20">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-0 md:max-w-7xl mx-auto space-y-12">
          {/* Back Link */}
          <Skeleton className="w-32 h-6" />

          {/* Hero Section */}
          <div className="space-y-8">
            <Skeleton className="h-16 w-3/4 max-w-lg" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full max-w-2xl" />
              <Skeleton className="h-4 w-2/3 max-w-2xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-4">
            <div className="col-span-1 lg:col-span-3 grid gap-10">
              {/* Why Choose Me */}
              <div>
                <Skeleton className="h-8 w-48 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`p-6 border border-white/5 bg-white/5 ${
                        isRounded ? "rounded-2xl" : ""
                      }`}
                    >
                      <Skeleton className="w-12 h-12 rounded-md mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6 mt-1" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <Skeleton className="h-8 w-48 mb-8" />
                <div className="flex flex-wrap gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 w-32" />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-1 lg:col-span-1">
              <Skeleton className="h-8 w-40 mb-8" />
              <div
                className={`p-5 w-full border border-white/5 bg-white/5 space-y-4 ${
                  isRounded ? "rounded-xl" : ""
                }`}
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="w-6 h-6 rounded-md shrink-0" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <Skeleton className="w-full h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const service = data.services.find((s) => s._id === id);

  if (!service)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Service Not Found
      </div>
    );

  return (
    <div className="min-h-screen pt-5 overflow-hidden pb-20">
      <SEO
        title={service.title}
        description={service.description}
        keywords={[service.title, "Service", "Web Development"]}
      />
      <div className="px-4 sm:px-6 lg:px-8 xl:px-0 md:max-w-7xl mx-auto space-y-12">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-white hover:text-secondary mb-8 transition"
        >
          <FaArrowLeft /> Back to Services
        </Link>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {service.title}
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl">
            {service.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-4">
          <div className="col-span-1 lg:col-span-3 grid gap-10">
            {/* Why Choose Me Section */}
            {service.whyChooseMe && service.whyChooseMe.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-8 text-white">
                  Why Choose Me?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {service.whyChooseMe.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-black/70 p-6 border border-white/10 hover:-translate-y-1 transition-transform duration-300 ${
                        isRounded ? "rounded-2xl" : ""
                      }`}
                    >
                      <div
                        className={`w-12 h-12 bg-secondary/20 flex items-center justify-center mb-4 ${
                          isRounded ? "rounded-full" : "rounded-md"
                        }`}
                      >
                        <RenderIcon
                          icon={item.icon || "mdi:star"}
                          className="text-2xl text-secondary"
                        />
                      </div>
                      <h4 className="text-xl font-bold mb-2 text-white">
                        {item.title}
                      </h4>
                      <p className="text-text-secondary text-sm">
                        {item.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack Section */}
            {service.techStack && service.techStack.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-8 text-white">
                  Technology Stack
                </h3>
                <div className="flex flex-wrap gap-6">
                  {service.techStack.map((stack, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className={`px-6 py-4 bg-black/70/50 border border-white/5 flex items-center gap-3 ${
                        isRounded ? "rounded-lg" : ""
                      }`}
                    >
                      <RenderIcon icon={stack.icon || "mdi:code-tags"} />
                      <span className="text-lg font-medium text-white">
                        {stack.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="col-span-1 lg:col-span-1">
            {/* Features Grid (If any) */}
            {service.features && service.features.length > 0 && (
              <>
                <h3 className="text-2xl font-bold mb-8 text-white">
                  Key Features
                </h3>
                <div
                  className={`grid gap-2 py-5 px-3 w-full max-w-lg bg-black/70/50 border border-white/5 ${
                    isRounded ? "rounded-xl" : ""
                  }`}
                >
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 group">
                      <span
                        className={`p-2 bg-primary/20 text-white/50 group-hover:text-white group-hover:bg-primary transition-colors shrink-0 ${
                          isRounded ? "rounded-full" : "rounded-md"
                        }`}
                      >
                        <FaCheck size={12} />
                      </span>
                      <span className="text-text-secondary group-hover:text-white transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Process Section */}
        {service.process && service.process.length > 0 && (
          <>
            <h3 className="text-2xl font-bold mb-10 text-white text-center">
              My Process
            </h3>
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {service.process.map((step, idx) => (
                <div
                  key={idx}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  {/* Icon */}
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-black/70 group-[.is-active]:bg-secondary text-text-secondary group-[.is-active]:text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}
                  >
                    <span className="text-sm font-bold">{idx + 1}</span>
                  </div>
                  {/* Card */}
                  <motion.div
                    initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-black/70 border border-white/10 ${
                      isRounded ? "rounded-xl" : ""
                    }`}
                  >
                    <h4 className="text-lg font-bold mb-2 text-white">
                      {step.title}
                    </h4>
                    <p className="text-text-secondary text-sm">
                      {step.description}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* FAQ Section */}
        {service.faq && service.faq.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-white text-center">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {service.faq.map((item, idx) => (
                <FAQItem
                  key={idx}
                  question={item.question}
                  answer={item.answer}
                  isRounded={isRounded}
                />
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <CTA />

        {/* Service Plans Section */}
        {service.plans && (
          <Plans
            plans={service.plans}
            title={`${service.title} Plans`}
            theme={service.theme || "fuchsia"}
          />
        )}
      </div>
    </div>
  );
};

// Simple FAQ Component
const FAQItem = ({ question, answer, isRounded }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border border-white/10 bg-black/70 overflow-hidden ${
        isRounded ? "rounded-xl" : ""
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-medium text-white hover:bg-white/5 transition-colors"
      >
        {question}
        {isOpen ? (
          <FaChevronUp className="text-text-secondary" />
        ) : (
          <FaChevronDown className="text-text-secondary" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="p-4 text-text-secondary border-t border-white/5">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceDetail;
