"use client";

import { useToastContext, type Toast as ToastType } from "./toast-provider";
import { twMerge } from "tailwind-merge";

const variantStyles = {
  error: {
    bg: "bg-[#EF4444]/10",
    border: "border-[#EF4444]",
    icon: "×",
    iconColor: "text-[#EF4444]",
  },
  success: {
    bg: "bg-[#22C55E]/10",
    border: "border-[#22C55E]",
    icon: "✓",
    iconColor: "text-[#22C55E]",
  },
  info: {
    bg: "bg-[#3B82F6]/10",
    border: "border-[#3B82F6]",
    icon: "i",
    iconColor: "text-[#3B82F6]",
  },
};

function ToastItem({ toast, onDismiss }: { toast: ToastType; onDismiss: () => void }) {
  const styles = variantStyles[toast.variant];

  return (
    <div
      className={twMerge(
        "flex items-start gap-3 rounded-lg border p-4 min-w-[320px] max-w-[420px] shadow-lg",
        styles.bg,
        styles.border
      )}
      style={{
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <span className={twMerge("font-mono text-lg font-bold", styles.iconColor)}>
        {styles.icon}
      </span>
      <div className="flex-1">
        <p className="font-mono text-sm text-[#FAFAFA]">{toast.title}</p>
        {toast.description && (
          <p className="font-mono text-xs text-[#6B7280] mt-1">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="font-mono text-xs text-[#6B7280] hover:text-[#FAFAFA] transition-colors"
      >
        ×
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, dismiss } = useToastContext();

  if (toasts.length === 0) return null;

  return (
    <>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </>
  );
}
