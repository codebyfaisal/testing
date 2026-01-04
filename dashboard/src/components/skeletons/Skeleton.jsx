import React from "react";

const Skeleton = ({ className, children }) => {
  return (
    <div
      className={`h-10 w-full bg-muted rounded animate-pulse ${className}`}
    >
      {children}
    </div>
  );
};

export default Skeleton;
