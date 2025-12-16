import React from "react";
import BentoItem from "./BentoItem";
import { FaEnvelope } from "react-icons/fa";
import { SocialHologram } from "./Illustrations";
import { Link } from "react-router-dom";
import { cn } from "../utils/cn";
import usePortfolioStore from "../store/usePortfolioStore";

import { Skeleton } from "./Skeleton";

import { siteConfig } from "../config/siteConfig";

const ContactPreview = ({ className }) => {
  const { isRounded, loading } = usePortfolioStore();

  if (loading) {
    return (
      <BentoItem
        className={cn(className)}
        header={<Skeleton className="w-full h-full min-h-24" />}
        title={<Skeleton className="h-6 w-32" />}
        description={<Skeleton className="h-4 w-48 mt-2" />}
      />
    );
  }

  return (
    <BentoItem
      className={cn("bg-secondary/10 border-secondary/20", className)}
      title={siteConfig?.pages?.home?.universe?.contact?.title}
      description={siteConfig?.pages?.home?.universe?.contact?.description}
      header={<SocialHologram />}
      icon={<FaEnvelope className="h-10 w-10 text-secondary" />}
    >
      <Link
        to="/contact"
        className={cn(
          "mt-4 block w-full text-center px-4 py-2 bg-secondary text-black text-sm font-bold hover:bg-white transition",
          isRounded && "rounded-lg"
        )}
      >
        {siteConfig?.pages?.home?.universe?.contact?.button}
      </Link>
    </BentoItem>
  );
};

export default ContactPreview;
