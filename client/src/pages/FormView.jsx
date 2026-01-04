import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "@/api/axios";
import { Skeleton, ApplicationForm, NotFound } from "@/components";
import usePortfolioStore from "@/store/usePortfolioStore";
import { cn } from "@/utils/cn";
import { FaArrowLeft, FaHome } from "react-icons/fa";

const SkeletonLoader = () => (
  <div className="min-h-screen pt-32 max-w-4xl mx-auto space-y-3">
    <Skeleton className="h-12 w-64" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="space-y-4 pt-8">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  </div>
);

const FormView = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { rounded } = usePortfolioStore();

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const { data } = await axios.get(`/forms/${id}`);
        setForm(data.data);
      } catch (error) {
        console.error("Failed to fetch form", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  if (isLoading) return <SkeletonLoader />;

  if (!form && !isLoading)
    return (
      <NotFound
        title="Form Not Found"
        description="The form you are looking for does not exist or has been removed."
        isFullPage={false}
        backgroundText="404"
        link="/"
        backTo="Home"
        showBackgroundBubbles={false}
        className="my-10"
        rounded={rounded}
      />
    );

  return (
    <section className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          {form.title}
        </h1>
        {form.description && (
          <p className="text-primary text-lg max-w-2xl mx-auto">
            {form.description}
          </p>
        )}
      </div>

      {form.isActive &&
      (!form.expiryDate || new Date(form.expiryDate) > new Date()) ? (
        <ApplicationForm formId={form._id} questions={form.questions} />
      ) : (
        <div className="text-center">
          <div
            className={cn(
              "inline-block px-6 py-4 bg-card border border-border mb-6",
              rounded
            )}
          >
            <p className="text-secondary">
              {form.expiryDate && new Date(form.expiryDate) < new Date()
                ? "This form has expired."
                : "This form is currently not accepting submissions."}
            </p>
          </div>
          <div>
            <Link
              to="/"
              className={cn(
                "bg-secondary text-foreground px-6 py-3 hover:bg-transparent hover:border-border hover:border flex items-center gap-2 w-max mx-auto",
                rounded
              )}
            >
              <span className="-translate-y-[2px]">
                <FaHome />
              </span>
              Return to Home
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default FormView;
