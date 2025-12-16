import React from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import usePortfolioStore from "../store/usePortfolioStore";
import SocialIcon from "./SocialIcon";
import { Button } from "./Button";
import { cn } from "../utils/cn";

const Footer = () => {
  const { user, isRounded } = usePortfolioStore();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10 mt-auto relative overflow-hidden">
      {/* Background Gradients */}
      <div
        className={cn(
          "absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] -z-10 pointer-events-none",
          isRounded && "rounded-full"
        )}
      />
      <div
        className={cn(
          "absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[100px] -z-10 pointer-events-none",
          isRounded && "rounded-full"
        )}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Large CTA Section */}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-8 space-y-4">
            <div>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                Interested in <br />
                <span className="text-neutral-500">working together?</span>
              </h2>
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Button
                  href={`mailto:${user?.email}`}
                  icon={FaEnvelope}
                  variant="primary"
                  padding="px-8 py-4"
                  className="text-lg font-bold"
                >
                  Get in touch
                </Button>
                <Button
                  href={`https://wa.me/${user?.phone}`}
                  icon={FaPhone}
                  variant="secondary"
                  padding="px-8 py-4"
                  className="text-lg font-bold"
                >
                  Book a call
                </Button>
              </div>
            </div>
            <div className="md:col-span-6 flex gap-4">
              {user?.socialLinks &&
                Object.entries(user?.socialLinks || {}).map(([social, url]) => (
                  <SocialIcon key={social} social={social} url={url} />
                ))}
            </div>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-white font-bold text-lg mb-6">Get in Touch</h3>
            <div className="space-y-6">
              <a
                href={`mailto:${user?.email}`}
                className="flex items-start gap-4 group"
              >
                <div
                  className={cn(
                    "w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-secondary shrink-0 group-hover:bg-secondary group-hover:text-black transition-all duration-300",
                    isRounded && "rounded-full"
                  )}
                >
                  <FaEnvelope size={16} />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                    Email Me
                  </p>
                  <p className="text-neutral-300 group-hover:text-white transition-colors">
                    {user?.email}
                  </p>
                </div>
              </a>

              <a
                href={`https://wa.me/${user?.phone}`}
                className="flex items-start gap-4 group"
              >
                <div
                  className={cn(
                    "w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-secondary shrink-0 group-hover:bg-secondary group-hover:text-black transition-all duration-300",
                    isRounded && "rounded-full"
                  )}
                >
                  <FaPhone size={16} />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                    Call Me
                  </p>
                  <p className="text-neutral-300 group-hover:text-white transition-colors">
                    {user?.phone}
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-secondary shrink-0",
                    isRounded && "rounded-full"
                  )}
                >
                  <FaMapMarkerAlt size={16} />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                    Location
                  </p>
                  <p className="text-neutral-300">{user?.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
          <p>
            &copy; {currentYear}{" "}
            <span className="text-neutral-300">
              {user?.name?.first + " " + user?.name?.last}
            </span>
            . All rights reserved.
          </p>
          <p className="mt-2 md:mt-0">
            Designed & Built with <span className="text-red-500">♥</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
