import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";
import type { ComponentProps, ReactNode } from "react";

const diffLineVariants = tv({
  base: "flex w-full font-mono text-[13px] px-4 py-2",
  variants: {
    type: {
      removed: "bg-[#1A0A0A] text-[#6B7280]",
      added: "bg-[#0A1A0F] text-[#FAFAFA]",
      context: "text-[#6B7280]",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

const prefixVariants = tv({
  base: "w-4 flex-shrink-0",
  variants: {
    type: {
      removed: "text-[#EF4444]",
      added: "text-[#10B981]",
      context: "text-[#6B7280]",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

type DiffLineVariants = VariantProps<typeof diffLineVariants>;

export interface DiffLineRootProps extends DiffLineVariants {
  children: ReactNode;
  className?: string;
}

export function DiffLineRoot({ type = "context", children, className }: DiffLineRootProps) {
  return (
    <div className={twMerge(diffLineVariants({ type, className }))}>
      {children}
    </div>
  );
}

export interface DiffLinePrefixProps extends DiffLineVariants {
  className?: string;
}

export function DiffLinePrefix({ type = "context", className }: DiffLinePrefixProps) {
  const prefix = type === "removed" ? "-" : type === "added" ? "+" : " ";
  return (
    <span className={twMerge(prefixVariants({ type, className }))}>
      {prefix}
    </span>
  );
}

export interface DiffLineContentProps extends ComponentProps<"span"> {
  children: ReactNode;
}

export function DiffLineContent({ children, className, ...props }: DiffLineContentProps) {
  return (
    <span className={twMerge("flex-1 overflow-x-auto", className)} {...props}>
      {children}
    </span>
  );
}

export interface DiffLineProps extends DiffLineVariants {
  code: string;
  className?: string;
}

export function DiffLine({ type = "context", code, className }: DiffLineProps) {
  return (
    <DiffLineRoot type={type} className={className}>
      <DiffLinePrefix type={type} />
      <DiffLineContent>{code}</DiffLineContent>
    </DiffLineRoot>
  );
}
