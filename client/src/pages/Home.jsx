import React from "react";
import { Hero, Testimonials, Universe, SEO, CTA } from "../components";
import usePortfolioStore from "../store/usePortfolioStore";
import { siteConfig } from "../config/siteConfig";

const Home = () => {
  const homeConfig = siteConfig?.pages?.home;
  const { data, loading } = usePortfolioStore();

  if (!data && !loading) return null;

  return (
    <div className="min-h-screen">
      <SEO description={homeConfig?.seo?.description} />

      {/* Hero Section */}
      <Hero heroConfig={homeConfig?.hero} />

      {/* Universe Section */}
      <Universe />

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <CTA />
    </div>
  );
};

export default Home;
