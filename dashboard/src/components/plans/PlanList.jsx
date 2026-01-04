import React, { useEffect } from "react";
import useDashboardStore from "@/store/useDashboardStore";

import { FaEdit, FaTrash, FaMoneyBill } from "react-icons/fa";
import { Button, Card, NotFound } from "@/components";

const PlanList = ({ onEdit, onDelete }) => {
  const { fetchPlans, plans } = useDashboardStore();

  useEffect(() => {
    fetchPlans();
  }, []);

  if (!plans || plans.length === 0) {
    return (
      <NotFound
        Icon={FaMoneyBill}
        message="No plans found."
        className="col-span-full"
      />
    );
  }

  return (
    <>
      {plans.map((plan, index) => (
        <Card
          key={plan._id}
          className="overflow-hidden flex flex-col w-full max-w-md mx-auto md:mx-0"
          padding="p-0"
        >
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground mb-1">
              {plan.name}
            </h2>
            <h2 className="text-2xl font-bold text-primary">
              {plan.price?.currency} {plan.price?.min}
              {plan.price?.max && ` - ${plan.price.max}`}
            </h2>
          </div>

          <div className="p-6 bg-muted/30 grow">
            <h3 className="text-sm font-medium text-muted-foreground uppercase mb-4">
              Features
            </h3>
            <ul className="space-y-2 mb-4">
              {plan.features.map((feature, fIndex) => (
                <li
                  key={fIndex}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></span>
                  {feature}
                </li>
              ))}
            </ul>

            {plan.addOns?.show && plan.addOns.options?.length > 0 && (
              <>
                <h3 className="text-sm font-medium text-muted-foreground uppercase mb-4 mt-6 border-t border-border pt-4">
                  Add-Ons
                </h3>
                <ul className="space-y-2">
                  {plan.addOns.options.map((addon, aIndex) => (
                    <li
                      key={aIndex}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></span>
                      {addon}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => onEdit(plan)}
              uiType="primary"
              icon={<FaEdit size={12} />}
              label="Edit"
              className="w-1/2 rounded-none"
            />
            <Button
              onClick={() => onDelete(plan._id)}
              uiType="danger"
              icon={<FaTrash size={12} />}
              className="w-1/2 rounded-none"
              label="Delete"
            />
          </div>
        </Card>
      ))}
    </>
  );
};

export default PlanList;
