import React from "react";
import { Button } from "./Button";
import { siteConfig } from "../config/siteConfig";

const CTA = () => {
  return (
    <div className="relative overflow-hidden bg-linear-to-b from-primary/20 to-secondary/20 p-12 text-center">
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white mb-4">
          {siteConfig.cta.heading}
        </h2>
        <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
          {siteConfig.cta.description}
        </p>
        <Button to="/contact" variant="white" size="lg">
          {siteConfig.cta.primaryBtn}
        </Button>
      </div>
    </div>
  );
};

export default CTA;
