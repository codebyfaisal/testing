import React, { useState } from "react";
import {
  PageHeader,
  SEO,
  Button,
  SocialIcons,
  Skeleton,
  Input,
  Select,
  Textarea,
} from "@/components";
import { cn } from "@/utils/cn";
import usePortfolioStore from "@/store/usePortfolioStore";
import portfolioService from "@/api/portfolio.service";
import { toast } from "react-hot-toast";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import { siteConfig } from "@/config/siteConfig";

const SkeletonLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
    <div className="space-y-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="w-12 h-12" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      ))}
    </div>
    <div className="p-8 border border-border space-y-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  </div>
);

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
  const { config, user, rounded, loading } = usePortfolioStore();
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

  if (!config || !user) return null;

  return (
    <>
      <SEO
        title={seo?.title}
        description={seo?.description}
        keywords={seo?.keywords}
      />

      <PageHeader
        title={header?.title}
        description={header?.description}
        className="text-center"
      />

      {loading ? (
        <SkeletonLoader />
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="space-y-8 md:col-span-2">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-12 h-12 bg-secondary/10 flex items-center justify-center text-secondary text-xl shrink-0",
                  rounded
                )}
              >
                <FaEnvelope />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1 transition-colors duration-300">
                  {info?.email}
                </h3>
                <p className="text-muted-foreground transition-colors duration-300">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-12 h-12 bg-secondary/10 flex items-center justify-center text-secondary text-xl shrink-0",
                  rounded
                )}
              >
                <FaPhone />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1 transition-colors duration-300">
                  {info?.phone}
                </h3>
                <p className="text-muted-foreground transition-colors duration-300">
                  {user.phone}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-12 h-12 bg-secondary/10 flex items-center justify-center text-secondary text-xl shrink-0",
                  rounded
                )}
              >
                <FaMapMarkerAlt />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1 transition-colors duration-300">
                  {info?.location}
                </h3>
                <p className="text-muted-foreground transition-colors duration-300">
                  {user.location}
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-border">
              <h3 className="text-lg font-bold text-foreground mb-4 transition-colors duration-300">
                {connect}
              </h3>
              <div className="flex gap-4">
                {user?.socialLinks &&
                  Object.entries(user?.socialLinks || {}).map(
                    ([social, url]) => (
                      <SocialIcons key={social} social={social} url={url} />
                    )
                  )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className={cn(
              "bg-card/80 backdrop-blur-3xl p-8 border border-border transition-colors duration-300 md:col-span-3",
              rounded
            )}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="text"
                id="name"
                name="name"
                label={
                  <span>
                    {formConfig?.labels?.name}{" "}
                    <span className="text-red-500">*</span>
                  </span>
                }
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={formConfig?.placeholders.name}
              />
              <Input
                type="email"
                id="email"
                name="email"
                label={
                  <span>
                    {formConfig?.labels?.email}{" "}
                    <span className="text-red-500">*</span>
                  </span>
                }
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={formConfig?.placeholders.email}
              />

              {messageTypes.length > 0 && (
                <Select
                  id="type"
                  name="type"
                  label={formConfig?.labels?.topic}
                  value={formData.type}
                  onChange={handleChange}
                  options={[
                    {
                      type: formConfig?.placeholders.topic,
                      disabled: true,
                      selected: true,
                    },
                    ...messageTypes,
                  ]}
                />
              )}

              <Textarea
                id="message"
                name="message"
                label={
                  <span>
                    {formConfig?.labels?.message}{" "}
                    <span className="text-red-500">*</span>
                  </span>
                }
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                placeholder={formConfig?.placeholders.message}
              ></Textarea>
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
          </div>
        </section>
      )}
    </>
  );
};

export default Contact;
