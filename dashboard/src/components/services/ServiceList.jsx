import React, { useEffect } from "react";
import useDashboardStore from "@/store/useDashboardStore";
import { FaEdit, FaTrash, FaServicestack } from "react-icons/fa";
import { Button, Card, NotFound, RenderIcon } from "@/components";
import defaultIcons from "@/defaultIcons";

const ServiceList = ({ onEdit, onDelete }) => {
  const { fetchServices, services } = useDashboardStore();

  useEffect(() => {
    fetchServices();
  }, []);

  if (!services || services.length === 0) {
    return (
      <NotFound
        Icon={FaServicestack}
        message="No services found."
        className="col-span-full"
      />
    );
  }

  return (
    <>
      {services.map((service, index) => (
        <Card
          key={service._id}
          className="overflow-hidden w-full max-w-md mx-auto md:mx-0"
          padding="p-0"
        >
          <div className="flex flex-col justify-between h-full gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-lg text-2xl p-4 pt-6">
                <RenderIcon
                  icon={service.icon}
                  defaultIcon={defaultIcons.service}
                />
              </div>

              <h2 className="text-xl font-bold text-foreground px-4">
                {service.title}
              </h2>
              <p className="text-muted-foreground text-sm px-4">
                {service.description}
              </p>
            </div>
            <div className="flex justify-center gap-2 bg-muted w-full p-2 mt-4">
              <Button
                onClick={() => onEdit(service)}
                uiType="text"
                icon={<FaEdit size={12} />}
                label="Edit"
              />
              <Button
                onClick={() => onDelete(service._id)}
                uiType="text"
                icon={<FaTrash size={12} />}
                label="Delete"
              />
            </div>
          </div>
        </Card>
      ))}
    </>
  );
};

export default ServiceList;
