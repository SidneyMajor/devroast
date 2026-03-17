import { TRPCProvider } from "@/trpc/client";

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  return <TRPCProvider>{children}</TRPCProvider>;
}
