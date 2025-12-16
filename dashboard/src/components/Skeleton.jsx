import React from "react";

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-zinc-800 rounded-md ${className}`} />
  );
};

export default Skeleton;
