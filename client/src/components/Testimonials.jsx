import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
} from "react-icons/fa";
import VideoModal from "./VideoModal";
import usePortfolioStore from "../store/usePortfolioStore";

const Testimonials = () => {
  const { data, isRounded } = usePortfolioStore();
  const testimonials = data?.testimonials || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setShowVideo(false);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setShowVideo(false);
  };

  useEffect(() => {
    if (!showVideo) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [testimonials.length, showVideo]);

  if (!testimonials || testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="px-4 sm:px-6 lg:px-8 bg-black/50 relative overflow-hidden min-h-[90vh]">
      {/* Background Elements */}
      <div
        className={`absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-3xl -z-10 ${
          isRounded ? "rounded-full" : ""
        }`}
      />
      <div
        className={`absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 blur-3xl -z-10 ${
          isRounded ? "rounded-full" : ""
        }`}
      />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">
            Client <span className="text-secondary">Stories</span>
          </h2>
          <p className="text-neutral-400">
            Feedback from people I've worked with.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div
            className={`bg-white/5 border border-white/10 backdrop-blur-sm p-8 md:p-10 relative min-h-[250px] ${
              isRounded ? "rounded-2xl" : ""
            }`}
          >
            {/* Top Right Navigation */}
            <div className="absolute top-6 right-6 flex gap-2 z-20">
              <button
                onClick={prevSlide}
                className={`p-2 bg-white/5 border border-white/10 text-white hover:bg-secondary hover:text-black transition duration-300 ${
                  isRounded ? "rounded-full" : ""
                }`}
                aria-label="Previous testimonial"
              >
                <FaChevronLeft size={12} />
              </button>
              <button
                onClick={nextSlide}
                className={`p-2 bg-white/5 border border-white/10 text-white hover:bg-secondary hover:text-black transition duration-300 ${
                  isRounded ? "rounded-full" : ""
                }`}
                aria-label="Next testimonial"
              >
                <FaChevronRight size={12} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0.1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row gap-8 items-center md:items-start text-left"
              >
                {/* Left: Profile & Actions */}
                <div className="flex flex-col items-center md:items-start shrink-0 md:w-48">
                  <div
                    className={`w-20 h-20 border-2 border-secondary/50 p-1 mb-4 ${
                      isRounded ? "rounded-full" : ""
                    }`}
                  >
                    <img
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.name}
                      className={`w-full h-full object-cover ${
                        isRounded ? "rounded-full" : ""
                      }`}
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-lg font-bold text-white">
                      {currentTestimonial.name}
                    </h4>
                    <p className="text-secondary text-sm mb-3">
                      {currentTestimonial.role}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowVideo(true)}
                    className={`flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors text-white border border-white/10 ${
                      isRounded ? "rounded-full" : ""
                    } ${currentTestimonial.video ? "" : "opacity-0"}`}
                    aria-label="Watch video"
                    disabled={!currentTestimonial.video}
                  >
                    <FaPlay className="text-[10px]" /> Watch Video
                  </button>
                </div>

                {/* Right: Quote */}
                <div className="relative flex-1 flex flex-col justify-center pt-8 md:pt-0">
                  <FaQuoteLeft className="text-3xl text-secondary/20 mb-4" />
                  <p className="text-lg md:text-2xl text-neutral-300 italic leading-relaxed min-h-[120px] flex items-center">
                    "{currentTestimonial.text}"
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 transition-all duration-300 ${
                  isRounded ? "rounded-full" : ""
                } ${
                  index === currentIndex
                    ? "bg-secondary w-6"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal Component */}
      <VideoModal
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
        video={currentTestimonial.video}
      />
    </section>
  );
};

export default Testimonials;
