import React from "react";
import Icon from "./Icon";

export default function Button({
  children,
  variant = "primary", // "primary" | "secondary" | "ghost"
  size = "md", // "sm" | "md" | "lg"
  icon = null, // icon name from Icon registry (optional)
  iconPosition = "left",
  fullWidth = false,
  className = "",
  disabled = false,
  onClick,
  ...props
}) {
  // Base styles matching Figma specs
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-[8px] transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed leading-[145%]";

  // Color Variants
  const variants = {
    primary:
      "bg-[#6F01D0] hover:bg-[#5e00b3] active:bg-[#52009e] text-white shadow-md shadow-purple-950/40",
    secondary:
      "bg-[#2E2E2E] hover:bg-[#383838] active:bg-[#252525] border border-neutral-700/50 text-white",
    ghost:
      "bg-transparent hover:bg-[#2E2E2E] active:bg-[#252525] text-neutral-300 hover:text-white",
  };

  // Size Variants (Padding & Font sizes)
  const sizes = {
    sm: "px-3 py-1 text-xs gap-1.5",
    md: "px-[23px] py-[6px] text-[14px] gap-[8px]", // matches exact Figma Add Map button
    lg: "px-6 py-2.5 text-base gap-2.5",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <Icon name={icon} size={size === "sm" ? 14 : 16} />
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <Icon name={icon} size={size === "sm" ? 14 : 16} />
      )}
    </button>
  );
}
