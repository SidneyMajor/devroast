"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[32px] font-bold text-[#EF4444]">!</span>
          <h1 className="font-mono text-[28px] font-bold text-[#FAFAFA]">
            algo correu mal
          </h1>
        </div>

        <p className="font-mono text-sm text-[#6B7280]">
          // erro interno do servidor
        </p>

        {error.digest && (
          <p className="font-mono text-xs text-[#4B5563]">
            reference: {error.digest}
          </p>
        )}

        <button
          onClick={reset}
          className="mt-4 rounded border border-[#2A2A2A] bg-[#1A1A1A] px-6 py-3 font-mono text-sm text-[#FAFAFA] transition-colors hover:bg-[#2A2A2A]"
        >
          tentar novamente
        </button>
      </div>
    </div>
  );
}
