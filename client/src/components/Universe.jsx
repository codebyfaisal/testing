import React from "react";
import BentoGrid from "./BentoGrid";
import AboutPreview from "./AboutPreview";
import TechStackPreview from "./TechStackPreview";
import ServicesPreview from "./ServicesPreview";
import PlansPreview from "./PlansPreview";
import ContactPreview from "./ContactPreview";
import ProjectsPreview from "./ProjectsPreview";
import ExperiencePreview from "./ExperiencePreview";
import { bentoItems } from "../config/bentoConfig";
import { siteConfig } from "../config/siteConfig";
import PageHeader from "./PageHeader";

const componentMap = {
  AboutPreview,
  TechStackPreview,
  ServicesPreview,
  PlansPreview,
  ContactPreview,
  ProjectsPreview,
  ExperiencePreview,
};

const Universe = () => {
  const universeConfig = siteConfig?.pages?.home?.universe;
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={{ ...universeConfig?.header?.title }}
        description={universeConfig?.header?.description}
      />

      <BentoGrid className="max-w-6xl mx-auto">
        {[...bentoItems]
          .sort((a, b) => a.priority - b.priority)
          .map((item) => {
            const Component = componentMap[item.component];
            if (!Component) return null;
            return <Component key={item.id} className={item.className} />;
          })}
      </BentoGrid>
    </section>
  );
};

export default Universe;
