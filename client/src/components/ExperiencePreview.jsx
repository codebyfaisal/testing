import React from "react";
import BentoItem from "./BentoItem";
import { cn } from "../utils/cn";
import usePortfolioStore from "../store/usePortfolioStore";
import { FaBriefcase } from "react-icons/fa";
import { Skeleton } from "./Skeleton";
import { siteConfig } from "../config/siteConfig";

const ExperiencePreview = ({ className }) => {
  const { user = {}, loading } = usePortfolioStore();
  const experience = user?.experience || [];
  const expConfig = siteConfig?.pages?.home?.universe?.experience;

  if (loading) {
    return (
      <BentoItem className={cn(className)}>
        <Skeleton className="w-full h-full min-h-24" />
      </BentoItem>
    );
  }

  const latestRole = experience[0];

  return (
    <BentoItem
      className={cn("relative overflow-hidden group", className)}
      header={
        <>
          <div className="absolute top-6 right-4 text-orange-500/20 group-hover:text-orange-500 transition-colors">
            <FaBriefcase size={20} />
          </div>

          <div className="h-full flex flex-col justify-between z-10 py-0">
            <div className="mb-2">
              <h3 className="text-lg font-bold text-white mb-1">
                {expConfig?.title}
              </h3>
              <p className="text-xs text-zinc-400">{expConfig?.description}</p>
            </div>

            {latestRole ? (
              <div className="mt-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                  <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                    {latestRole.current
                      ? expConfig?.currentRoleTag
                      : expConfig?.latestRoleTag}
                  </p>
                </div>
                <h4 className="text-sm font-bold text-white leading-tight">
                  {latestRole.role}
                </h4>
                <p className="text-xs text-zinc-400 mt-1 truncate">
                  {expConfig?.at}{" "}
                  <span className="text-white">{latestRole.company}</span>
                </p>
              </div>
            ) : (
              <div className="mt-auto">
                <p className="text-xs text-zinc-500">
                  {expConfig?.noExperience}
                </p>
              </div>
            )}
          </div>
        </>
      }
    />
  );
};

export default ExperiencePreview;
