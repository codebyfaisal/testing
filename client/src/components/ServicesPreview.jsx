import React from "react";
import BentoItem from "./BentoItem";
import { FaCode } from "react-icons/fa";
import { ServicePreview } from "./Illustrations";
import { Button } from "./Button";
import usePortfolioStore from "../store/usePortfolioStore";
import { Skeleton } from "./Skeleton";
import RenderIcon from "./RenderIcon";
import { cn } from "../utils/cn";

import { siteConfig } from "../config/siteConfig";

const ServicesPreview = ({ className }) => {
  const { data, config, loading } = usePortfolioStore();

  if (loading) {
    return (
      <>
        <BentoItem className={cn(className)}>
          <Skeleton className="w-full h-full min-h-24" />
        </BentoItem>
      </>
    );
  }

  const defaultService = data?.services?.[0];

  const featuredServiceConfig = config?.featuredService || {};
  const selectedService = data?.services?.find(
    (s) => s._id === featuredServiceConfig.serviceId
  );

  const displayService = selectedService || defaultService;

  const servicesConfig = siteConfig?.pages?.home?.universe?.services;

  const serviceTitle =
    featuredServiceConfig.title ||
    displayService?.title ||
    servicesConfig?.title;

  const serviceDesc =
    featuredServiceConfig.description ||
    displayService?.description ||
    servicesConfig?.description;

  const serviceImage =
    featuredServiceConfig.image || displayService?.image || null;

  const serviceIcon =
    displayService?.icon && typeof displayService.icon === "string"
      ? displayService.icon
      : "";

  return (
    <>
      <BentoItem
        key="services-preview-item"
        className={cn(className)}
        title={serviceTitle}
        description={
          <span className="line-clamp-2 block" title={serviceDesc}>
            {serviceDesc}
          </span>
        }
        header={<ServicePreview image={serviceImage} />}
        icon={
          serviceIcon ? (
            <RenderIcon
              icon={serviceIcon}
              className="h-12 w-12 text-neutral-500"
            />
          ) : (
            <FaCode className="h-12 w-12 text-neutral-500" />
          )
        }
      >
        <Button to="/services" variant="secondary" className="w-full mt-4">
          {servicesConfig?.button}
        </Button>
      </BentoItem>
    </>
  );
};

export default ServicesPreview;
