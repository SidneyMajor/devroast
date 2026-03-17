"use client";

import { Switch } from "@base-ui/react/switch";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type ToggleProps = Pick<
  ComponentProps<"button">,
  "id" | "disabled" | "aria-label" | "aria-labelledby"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
};

function Toggle({
  checked,
  defaultChecked,
  onCheckedChange,
  label,
  className,
  ...props
}: ToggleProps) {
  return (
    <span className={twMerge("inline-flex items-center gap-3", className)}>
      <Switch.Root
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        className="group flex h-[22px] w-10 cursor-pointer items-center rounded-full bg-[#2A2A2A] p-[3px] transition-colors data-[checked]:bg-[#10B981]"
        {...props}
      >
        <Switch.Thumb className="size-4 rounded-full bg-[#6B7280] transition-transform data-[checked]:translate-x-[18px] data-[checked]:bg-[#0A0A0A]" />
      </Switch.Root>
      {label && (
        <span className="font-mono text-xs text-[#6B7280] group-has-[data-checked]:text-[#10B981] transition-colors">
          {label}
        </span>
      )}
    </span>
  );
}

export { Toggle, type ToggleProps };