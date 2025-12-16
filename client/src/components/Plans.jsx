import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FaCheck, FaRocket, FaSync } from "react-icons/fa";
import usePortfolioStore from "../store/usePortfolioStore";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import { siteConfig } from "../config/siteConfig";

const Plans = ({ plans }) => {
  const { isRounded } = usePortfolioStore();
  const [grid, setGrid] = useState(1);
  const plansConfig = siteConfig?.plans;

  useEffect(() => {
    if (plans?.length <= 1) setGrid(1);
    else if (plans?.length <= 2) setGrid(2);
    else if (plans?.length <= 3) setGrid(3);
    else if (plans?.length <= 4) setGrid(4);
  }, [plans]);

  if (!plans || plans.length === 0) return null;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {plansConfig?.heading}
          </h2>
          <p className="text-text-secondary">{plansConfig?.subHeading}</p>
        </motion.div>

        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 mx-auto gap-8 items-start",
            grid === 1 && "lg:grid-cols-1 max-w-lg",
            grid === 2 && "lg:grid-cols-2 max-w-xl",
            grid === 3 && "lg:grid-cols-3 max-w-6xl",
            grid === 4 && "lg:grid-cols-4"
          )}
        >
          {plans.map((plan, index) => {
            const isPopular = plan.popular;
            return (
              <motion.div
                key={plan._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative overflow-hidden bg-black/70 p-8 border flex flex-col transition-all duration-300 h-full",
                  isRounded && "rounded-3xl",
                  isPopular
                    ? "border-secondary shadow-2xl shadow-secondary/20 scale-105 z-10"
                    : "border-white/10 hover:border-white/20"
                )}
              >
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {isPopular && (
                    <p
                      className={cn(
                        "absolute -top-4 right-0 px-3 py-1 text-xs font-bold text-black bg-secondary uppercase tracking-wide",
                        isRounded ? "rounded-full" : "rounded-bl-lg"
                      )}
                    >
                      {plansConfig?.popularTag}
                    </p>
                  )}

                  <div className="mb-6 text-center">
                    <h3 className="text-2xl font-bold mb-4 text-secondary">
                      {plan.name}
                    </h3>

                    <div className="flex items-center justify-center gap-1 text-white">
                      {plan.price?.min && plan.price?.max ? (
                        <div className="flex items-center gap-1">
                          <span className="text-4xl font-bold">
                            {plan.price.currency}
                            {plan.price.min}
                          </span>
                          <span className="text-text-secondary text-2xl">
                            -
                          </span>
                          <span className="text-4xl font-bold">
                            {plan.price.currency}
                            {plan.price.max}
                          </span>
                        </div>
                      ) : plan.price?.min ? (
                        <div className="flex items-end gap-2">
                          <span className="text-lg text-text-secondary">
                            {plansConfig?.startingAt}
                          </span>
                          <span className="text-4xl font-bold">
                            {plan.price.currency}
                            {plan.price.min}
                          </span>
                        </div>
                      ) : (
                        <span className="text-4xl font-bold">Contact</span>
                      )}
                    </div>
                  </div>

                  {/* Meta Info: Delivery & Addons */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                    {plan.deliveryTime?.show && (
                      <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full text-xs font-medium text-text-secondary">
                        <FaRocket className="text-accent" size={10} />
                        <span>
                          {plan.deliveryTime.time} {plan.deliveryTime.unit}{" "}
                          {plansConfig?.unit}
                        </span>
                      </div>
                    )}
                    {plan.revisions?.show && (
                      <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full text-xs font-medium text-secondary">
                        <FaSync className="text-secondary" size={10} />
                        <span>
                          {plan.revisions.count} {plansConfig?.revisions}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 mb-8 grow">
                    {plan.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 text-text-secondary"
                      >
                        <div
                          className={cn(
                            "w-5 h-5 flex items-center justify-center shrink-0 bg-secondary/10 text-secondary mt-0.5",
                            isRounded ? "rounded-full" : "rounded"
                          )}
                        >
                          <FaCheck size={10} />
                        </div>
                        <span className="text-sm leading-relaxed text-text-secondary">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {plan.addOns?.show &&
                    plan.addOns.options &&
                    plan.addOns.options.length > 0 && (
                      <div className="mb-8 pt-6 border-t border-white/10">
                        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3 text-center">
                          {plansConfig?.addOns}
                        </h4>
                        <div className="space-y-2">
                          {plan.addOns.options.map((addon, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-xs text-text-secondary"
                            >
                              <span className="w-1 h-1 bg-secondary rounded-full mt-1.5 shrink-0"></span>
                              {addon}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  <Button
                    to="/contact"
                    variant={
                      plan.isCustom
                        ? "white"
                        : isPopular
                        ? "primary"
                        : "secondary"
                    }
                    className={cn(
                      "w-full text-sm tracking-wide uppercase",
                      isPopular && "shadow-lg shadow-secondary/20"
                    )}
                  >
                    {plan.isCustom
                      ? plansConfig?.buttons?.contact
                      : plansConfig?.buttons?.start}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Plans;
