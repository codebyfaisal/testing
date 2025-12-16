import { useState } from "react";
import { motion } from "motion/react";
import { FaPlayCircle, FaFileDownload } from "react-icons/fa";
import { Link } from "react-router-dom";
import usePortfolioStore from "../store/usePortfolioStore";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import SocialIcon from "./SocialIcon";
import { Skeleton } from "./Skeleton";
import VideoModal from "./VideoModal";

const Hero = ({ heroConfig }) => {
  const { isRounded, config, user, loading } = usePortfolioStore();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  if (loading) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center py-15 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <Skeleton className="w-32 h-8 rounded-full mb-6" />
            <Skeleton className="w-full max-w-lg h-24 mb-6" />
            <Skeleton className="w-full max-w-md h-16 mb-8" />
            <div className="flex gap-4 mb-12">
              <Skeleton className="w-32 h-12 rounded-lg" />
              <Skeleton className="w-32 h-12 rounded-lg" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Skeleton className="w-full max-w-md aspect-square rounded-full opacity-20" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center py-15 relative overflow-hidden">
      {/* Background Elements */}
      <div
        className={cn(
          "absolute top-1/4 -left-20 w-72 h-72 bg-secondary/20 blur-[100px]",
          isRounded ? "rounded-full" : "rounded-lg"
        )}
      />
      <div
        className={cn(
          "absolute bottom-1/4 -right-20 w-72 h-72 bg-accent/20 blur-[100px]",
          isRounded ? "rounded-full" : "rounded-lg"
        )}
      />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className={cn(
              "inline-block px-4 py-2 bg-black/70 border border-white/10 rounded-full",
              isRounded ? "rounded-full" : "rounded-lg"
            )}
          >
            <span className="text-secondary font-medium">
              {config?.hero?.greeting || heroConfig?.greeting}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-text-secondary">
              {config?.hero?.title || heroConfig.title}
            </span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
            {config?.hero?.subTitle || config?.user?.bio || heroConfig.subTitle}
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Button to="/contact" variant="primary" size="lg">
              Let's Talk
            </Button>

            {user?.resume && (
              <Button
                href={user?.resume}
                variant="secondary"
                size="lg"
                icon={FaFileDownload}
              >
                {heroConfig?.buttons?.resume || 'Resume'}
              </Button>
            )}
            {user?.introVideo && (
              <Button
                onClick={() => setIsVideoOpen(true)}
                variant="secondary"
                size="lg"
                icon={FaPlayCircle}
              >
                {heroConfig?.buttons?.video || 'Intro'}
              </Button>
            )}
          </div>

          <div className="flex gap-6 items-center">
            <span className="w-12 h-px bg-white/10"></span>
            <div className="flex gap-6">
              {user?.socialLinks &&
                Object.entries(user?.socialLinks || {}).map(([social, url]) => (
                  <SocialIcon key={social} social={social} url={url} />
                ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative lg:h-[600px] flex items-center justify-center"
        >
          <div
            className={cn(
              "relative z-10 w-full max-w-md aspect-square overflow-hidden border border-white/10 bg-black/70 backdrop-blur-sm",
              isRounded ? "rounded-full" : "rounded-lg"
            )}
          >
            {config?.hero?.image || user?.avatar ? (
              <img
                src={config?.hero?.image || user?.avatar}
                alt="Hero"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-secondary">
                No Image
              </div>
            )}
          </div>

          {/* Decorative circles */}
          <div
            className={cn(
              "absolute -z-10 w-2/4 aspect-square scale-180 border border-white/5 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse",
              isRounded ? "rounded-full" : "rounded-lg"
            )}
          />
          <div
            className={cn(
              "absolute -z-10 w-3/4 aspect-square scale-150 border border-white/5 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse",
              isRounded ? "rounded-full" : "rounded-lg"
            )}
          />
        </motion.div>
      </div>

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        video={{ src: user?.introVideo }}
      />
    </section>
  );
};

export default Hero;
