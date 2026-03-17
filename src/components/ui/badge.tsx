import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badge = tv({
  base: "inline-flex items-center gap-2 font-mono text-xs",
  variants: {
    variant: {
      critical: "text-[#EF4444]",
      warning: "text-[#F59E0B]",
      good: "text-[#10B981]",
      verdict: "text-[#EF4444]",
    },
  },
  defaultVariants: {
    variant: "critical",
  },
});

const badgeDot = tv({
  base: "size-2 rounded-full",
  variants: {
    variant: {
      critical: "bg-[#EF4444]",
      warning: "bg-[#F59E0B]",
      good: "bg-[#10B981]",
      verdict: "bg-[#EF4444]",
    },
  },
  defaultVariants: {
    variant: "critical",
  },
});

type BadgeVariants = VariantProps<typeof badge>;

type BadgeProps = ComponentProps<"span"> & BadgeVariants;

function Badge({ variant, className, children, ...props }: BadgeProps) {
  return (
    <span className={badge({ variant, className })} {...props}>
      <span className={badgeDot({ variant })} />
      {children}
    </span>
  );
}

export { Badge, badge, type BadgeProps, type BadgeVariants };