import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Shell } from "@/components/shell";
import { Toaster } from "@/components/ui/toaster";
import NonSsr from "@/components/non-ssr";
import { CSPostHogProvider } from "./providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Fake Papers",
  description: "Generate realistic-looking joke research papers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CSPostHogProvider>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <Shell>{children}</Shell>
          <Toaster />
        </body>
      </CSPostHogProvider>
    </html>
  );
}
