import React, { useEffect } from "react";
import useDashboardStore from "@/store/useDashboardStore";

import { FaEdit, FaTrash, FaQuoteLeft, FaCommentDots } from "react-icons/fa";
import { Button, NotFound, Card } from "@/components";

const TestimonialList = ({ onEdit, onDelete }) => {
  const { fetchTestimonials, testimonials } = useDashboardStore();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  if (!testimonials || testimonials.length === 0) {
    return (
      <NotFound
        Icon={FaCommentDots}
        message="No testimonials found."
        className="col-span-full"
      />
    );
  }

  return (
    <>
      {testimonials.map((testimonial, index) => (
        <Card
          key={testimonial._id}
          className="max-w-md w-full mx-auto relative flex flex-col"
        >
          <FaQuoteLeft className="absolute top-6 right-6 text-border text-4xl" />

          <div className="flex items-center gap-4 mb-4 relative z-10">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-border"
            />
            <div>
              <h3 className="font-bold text-foreground">{testimonial.name}</h3>
              <p className="text-xs text-primary">{testimonial.role}</p>
            </div>
          </div>

          <p className="text-muted-foreground text-sm mb-6 relative z-10 leading-relaxed grow">
            "{testimonial.text}"
          </p>

          {(testimonial.hasVideo || testimonial.video) && (
            <Card className="mb-4 relative z-10 w-full overflow-hidden">
              {testimonial.videoType === "video" ? (
                <video
                  src={testimonial.videoUrl || testimonial.video}
                  controls
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <iframe
                  src={testimonial.videoUrl || testimonial.video}
                  title="Testimonial Video"
                  className="w-full aspect-video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </Card>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-border mt-auto">
            <Button
              onClick={() => onEdit(testimonial)}
              uiType="text"
              icon={<FaEdit />}
              label="Edit"
            />
            <Button
              onClick={() => onDelete(testimonial._id)}
              uiType="text"
              icon={<FaTrash />}
              label="Delete"
            />
          </div>
        </Card>
      ))}
    </>
  );
};

export default TestimonialList;
