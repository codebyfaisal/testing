import React from "react";
import { Hero, Testimonials, Universe, SEO } from "@/components";
import { siteConfig } from "@/config/siteConfig";

const Home = () => {
  const homeConfig = siteConfig?.pages?.home;

  return (
    <>
      <SEO description={homeConfig?.seo?.description} />

      {/* Hero Section */}
      <Hero heroConfig={homeConfig?.hero} />

      <div className="px-4 md:px-8 max-w-7xl mx-auto my-15 space-y-20">
        {/* Universe Section */}
        <Universe />

        {/* Testimonials Section */}
        <Testimonials />
      </div>
    </>
  );
};

export default Home;
