import React from "react";
import { FaEdit, FaTrash, FaQuoteLeft } from "react-icons/fa";
import { Button, Card } from "@/components";

const TestimonialList = ({ testimonials, onEdit, onDelete }) => {
  return testimonials.map((testimonial) => (
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
        <Card className="mb-4 relative z-10 w-full overflow-hidden" padding="">
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

      <div className="flex justify-end gap-2 mt-auto">
        <Button
          onClick={() => onEdit(testimonial)}
          uiType="action"
          icon={<FaEdit />}
          label="Edit"
          title="Edit Testimonial"
        />
        <Button
          onClick={() => onDelete(testimonial._id)}
          uiType="action"
          icon={<FaTrash />}
          label="Delete"
          title="Delete Testimonial"
        />
      </div>
    </Card>
  ));
};

export default TestimonialList;
