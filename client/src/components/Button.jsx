import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../utils/cn";
import usePortfolioStore from "../store/usePortfolioStore";

const ButtonBase = ({
  as: Component = "button",
  className,
  children,
  variant = "primary",
  size = "md",
  padding,
  icon: Icon,
  isRounded,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary: "bg-secondary text-white hover:bg-secondary/90",
    secondary: "bg-black/70 border border-white/10 text-white hover:bg-white/5",
    outline:
      "bg-transparent border border-white/10 text-white hover:bg-white/5",
    text: "bg-transparent text-text-secondary hover:text-white",
    white: "bg-white text-black hover:bg-neutral-200",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };

  return (
    <Component
      className={cn(
        baseStyles,
        variants[variant],
        padding || sizes[size],
        isRounded ? "rounded-full" : "rounded-lg",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="mr-2" />}
      {children}
    </Component>
  );
};

export const Button = ({ to, href, children, ...props }) => {
  const { isRounded } = usePortfolioStore();

  if (to) {
    return (
      <ButtonBase as={Link} to={to} isRounded={isRounded} {...props}>
        {children}
      </ButtonBase>
    );
  }

  if (href) {
    return (
      <ButtonBase
        as="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        isRounded={isRounded}
        {...props}
      >
        {children}
      </ButtonBase>
    );
  }

  return (
    <ButtonBase isRounded={isRounded} {...props}>
      {children}
    </ButtonBase>
  );
};
