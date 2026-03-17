import { twMerge } from "tailwind-merge";
import type { ComponentProps, ReactNode } from "react";

export interface CardRootProps extends ComponentProps<"div"> {
  children: ReactNode;
}

export function CardRoot({ children, className, ...props }: CardRootProps) {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-3 rounded-md border border-[#2A2A2A] bg-transparent p-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardBadgeProps extends ComponentProps<"span"> {
  children: ReactNode;
  variant?: "critical" | "warning" | "good" | "verdict";
}

export function CardBadge({ children, variant = "critical", className, ...props }: CardBadgeProps) {
  const colors = {
    critical: "bg-[#EF4444]",
    warning: "bg-[#F59E0B]",
    good: "bg-[#10B981]",
    verdict: "bg-[#EF4444]",
  };
  
  const textColors = {
    critical: "text-[#EF4444]",
    warning: "text-[#F59E0B]",
    good: "text-[#10B981]",
    verdict: "text-[#EF4444]",
  };

  return (
    <div className="flex items-center">
      <span className={twMerge("inline-flex items-center gap-2 font-mono text-xs", textColors[variant], className)} {...props}>
        <span className={twMerge("size-2 rounded-full", colors[variant])} />
        {children}
      </span>
    </div>
  );
}

export interface CardTitleProps extends ComponentProps<"p"> {
  children: ReactNode;
}

export function CardTitle({ children, className, ...props }: CardTitleProps) {
  return (
    <p className={twMerge("font-mono text-[13px] text-[#FAFAFA]", className)} {...props}>
      {children}
    </p>
  );
}

export interface CardDescriptionProps extends ComponentProps<"p"> {
  children: ReactNode;
}

export function CardDescription({ children, className, ...props }: CardDescriptionProps) {
  return (
    <p className={twMerge("font-[family:var(--font-secondary)] text-[12px] leading-relaxed text-[#6B7280]", className)} {...props}>
      {children}
    </p>
  );
}
