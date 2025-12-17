import React, { useState } from "react";
import { PageHeader, SEO, Button, SocialIcon } from "../components";
import { cn } from "../utils/cn";
import { motion } from "motion/react";
import usePortfolioStore from "../store/usePortfolioStore";
import portfolioService from "../api/portfolio.service";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";

import { Skeleton } from "../components/Skeleton";
import { siteConfig } from "../config/siteConfig";

const initialState = {
  name: "",
  email: "",
  type: "General",
  message: "",
};

const Contact = () => {
  const {
    seo,
    header,
    form: formConfig,
    info,
    connect,
  } = siteConfig?.pages?.contact;
  const { config, user, isRounded, loading } = usePortfolioStore();
  const messageTypes = config?.messageTypes || ["General", "Job", "Other"];

  const [formData, setFormData] = useState(initialState);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await portfolioService.sendMessage({
        from: formData.name,
        email: formData.email,
        subject: formData.type || "General Inquiry",
        message: formData.message,
        type: formData.type,
      });
      toast.success("Message sent successfully!");
      setFormData(initialState);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-5 overflow-hidden pb-20">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-0 md:max-w-7xl mx-auto">
          <PageHeader
            title={{ ...header?.title }}
            description={header?.loadingDesc}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 border border-white/10 rounded-2xl space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!config || !user) return null;

  return (
    <div className="min-h-screen pt-5 overflow-hidden pb-20">
      <SEO
        title={seo?.title}
        description={seo?.description}
        keywords={seo?.keywords}
      />
      <div className="px-4 sm:px-6 lg:px-8 xl:px-0 md:max-w-7xl mx-auto">
        <PageHeader
          title={{ ...header?.title }}
          description={header?.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-12 h-12 bg-secondary/10 flex items-center justify-center text-secondary text-xl shrink-0",
                  isRounded ? "rounded-full" : ""
                )}
              >
                <FaEnvelope />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {info?.email}
                </h3>
                <p className="text-text-secondary">{user.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-12 h-12 bg-secondary/10 flex items-center justify-center text-secondary text-xl shrink-0",
                  isRounded && "rounded-full"
                )}
              >
                <FaPhone />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {info?.phone}
                </h3>
                <p className="text-text-secondary">{user.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-12 h-12 bg-secondary/10 flex items-center justify-center text-secondary text-xl shrink-0",
                  isRounded && "rounded-full"
                )}
              >
                <FaMapMarkerAlt />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {info?.location}
                </h3>
                <p className="text-text-secondary">{user.location}</p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">{connect}</h3>
              <div className="flex gap-4">
                {user?.socialLinks &&
                  Object.entries(user?.socialLinks || {}).map(
                    ([social, url]) => (
                      <SocialIcon key={social} social={social} url={url} />
                    )
                  )}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={cn(
              "bg-black p-8 border border-white/10 rounded-2xl",
              isRounded && "rounded-2xl"
            )}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-text-secondary mb-2"
                >
                  {formConfig?.labels?.name}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={cn(
                    "w-full px-4 py-3 bg-black/70 border border-white/10 text-white focus:border-secondary focus:outline-none transition",
                    isRounded && "rounded-lg"
                  )}
                  placeholder={formConfig?.placeholders.name}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text-secondary mb-2"
                >
                  {formConfig?.labels?.email}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={cn(
                    "w-full px-4 py-3 bg-black/70 border border-white/10 text-white focus:border-secondary focus:outline-none transition",
                    isRounded && "rounded-lg"
                  )}
                  placeholder={formConfig?.placeholders.email}
                />
              </div>

              {messageTypes.length > 0 && (
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-text-secondary mb-2"
                  >
                    {formConfig?.labels?.topic}
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-4 py-3 bg-black/70 border border-white/10 text-white focus:border-secondary focus:outline-none transition appearance-none capitalize",
                      isRounded && "rounded-lg"
                    )}
                  >
                    <option value="" className="bg-black text-secondary">
                      {formConfig?.placeholders.topic}
                    </option>
                    {messageTypes.map((item, index) => (
                      <option
                        key={index}
                        value={typeof item === "string" ? item : item.type}
                        className="bg-black"
                      >
                        {typeof item === "string" ? item : item.type}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-text-secondary mb-2"
                >
                  {formConfig?.labels?.message}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className={cn(
                    "w-full px-4 py-3 bg-black/70 border border-white/10 text-white focus:border-secondary focus:outline-none transition",
                    isRounded && "rounded-lg"
                  )}
                  placeholder={formConfig?.placeholders.message}
                ></textarea>
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  formConfig?.submitBtn?.sending
                ) : (
                  <>
                    <FaPaperPlane /> {formConfig?.submitBtn?.idle}
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
