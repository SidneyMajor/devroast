import type { Metadata } from "next";
import { JetBrains_Mono, IBM_Plex_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { TRPCReactProvider } from "@/trpc/react-provider";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "devroast — drop your code, get roasted",
  description: "Submit your code and get brutally honest feedback from our AI-powered code reviewer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} ${ibmPlexMono.variable} antialiased bg-[#0A0A0A] text-[#FAFAFA] min-h-screen`}
      >
        <TRPCReactProvider>
          <Navbar />
          <main>{children}</main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
