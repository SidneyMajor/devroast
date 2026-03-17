import { twMerge } from "tailwind-merge";
import type { ComponentProps, ReactNode } from "react";

export interface TableRowRootProps extends ComponentProps<"div"> {
  children: ReactNode;
}

export function TableRowRoot({ children, className, ...props }: TableRowRootProps) {
  return (
    <div
      className={twMerge(
        "flex w-full items-center gap-6 border-b border-[#2A2A2A] py-4 pl-5 pr-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TableRowRankProps extends ComponentProps<"span"> {
  children: ReactNode;
}

export function TableRowRank({ children, className, ...props }: TableRowRankProps) {
  return (
    <span className={twMerge("w-10 font-mono text-[13px] text-[#6B7280]", className)} {...props}>
      {children}
    </span>
  );
}

export interface TableRowScoreProps extends ComponentProps<"span"> {
  children: ReactNode;
}

export function TableRowScore({ children, className, ...props }: TableRowScoreProps) {
  return (
    <span className={twMerge("w-[60px] font-mono text-[13px] font-bold text-[#EF4444]", className)} {...props}>
      {children}
    </span>
  );
}

export interface TableRowCodeProps extends ComponentProps<"span"> {
  children: ReactNode;
}

export function TableRowCode({ children, className, ...props }: TableRowCodeProps) {
  return (
    <span className={twMerge("flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[12px] text-[#6B7280]", className)} {...props}>
      {children}
    </span>
  );
}

export interface TableRowLanguageProps extends ComponentProps<"span"> {
  children: ReactNode;
}

export function TableRowLanguage({ children, className, ...props }: TableRowLanguageProps) {
  return (
    <span className={twMerge("w-[100px] font-mono text-[12px] text-[#6B7280]", className)} {...props}>
      {children}
    </span>
  );
}
