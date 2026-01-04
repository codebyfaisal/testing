import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaExpand } from "react-icons/fa";
import { cn } from "@/utils/cn";
import { ServiceIllustration } from "./universe/previews/Illustrations";

const ImageSlider = ({ images = [], title, rounded }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-play
  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, images]);

  // No images: Show Illustration
  if (!images || images.length === 0) {
    return (
      <figure className="relative w-full h-full overflow-hidden group m-0">
        <ServiceIllustration />
        {title && <figcaption className="sr-only">{title}</figcaption>}
      </figure>
    );
  }

  // Single image view: No controls
  if (images.length === 1) {
    return (
      <figure className="relative w-full h-full overflow-hidden group m-0">
        <img
          src={images[0]}
          alt={title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent pointer-events-none w-full h-full" />
        {title && <figcaption className="sr-only">{title}</figcaption>}
      </figure>
    );
  }

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = images.length - 1;
      if (nextIndex >= images.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const nextSlide = () => paginate(1);
  const prevSlide = () => paginate(-1);

  return (
    <figure className="relative w-full h-full overflow-hidden group m-0">
      <img
        key={currentIndex}
        src={images[currentIndex]}
        alt={`${title} - Slide ${currentIndex + 1}`}
        className="absolute w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent pointer-events-none w-full h-full" />
      {/* Navigation Arrows */}
      <button
        className={cn(
          "absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 opacity-0 group-hover:opacity-100 transition-all z-10 backdrop-blur-sm",
          rounded
        )}
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
      >
        <FaChevronLeft />
      </button>
      <button
        className={cn(
          "absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 opacity-0 group-hover:opacity-100 transition-all z-10 backdrop-blur-sm",
          rounded
        )}
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
      >
        <FaChevronRight />
      </button>
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={cn(
              "w-2.5 h-2.5 transition-all backdrop-blur-sm",
              rounded,
              idx === currentIndex
                ? "bg-primary w-6"
                : "bg-primary/50 hover:bg-primary/80"
            )}
          />
        ))}
      </div>
      {title && <figcaption className="sr-only">{title}</figcaption>}
    </figure>
  );
};

export default ImageSlider;
