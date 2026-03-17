import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      primary: "bg-[#10B981] text-[#0A0A0A]",
      secondary: "border border-[#2A2A2A] text-[#FAFAFA] py-2 px-4",
      danger: "bg-[#EF4444] text-[#FAFAFA]",
      outline: "border border-[#10B981] text-[#10B981] py-1.5 px-3",
      ghost: "text-[#6B7280] py-1.5 px-3",
      link: "border border-[#2A2A2A] text-[#6B7280] px-[6px] py-[1.5px]",
    },
    size: {
      sm: "py-2 px-4 text-xs",
      md: "py-2.5 px-6 text-[13px]",
      lg: "py-3 px-8 text-sm",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

const hoverVariants = tv({
  variants: {
    variant: {
      primary: "hover:bg-[#0D9668]",
      secondary: "hover:bg-[#2A2A2A]",
      danger: "hover:bg-[#DC2626]",
      outline: "hover:bg-[#10B981] hover:text-[#0A0A0A]",
      ghost: "hover:text-[#FAFAFA] hover:bg-[#2A2A2A]",
      link: "hover:bg-[rgba(107,114,128,0.1)]",
    },
  },
});

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  loading?: boolean;
  children: ReactNode;
}

export function Button({ className, variant, size, loading, children, disabled, ...props }: ButtonProps) {
  const isDisabled = disabled || loading;
  const hoverClass = !isDisabled ? hoverVariants({ variant: variant || "primary" }) : "";

  return (
    <button
      className={twMerge(buttonVariants({ variant, size, className }), hoverClass)}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
