import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Shell } from "@/components/shell";
import { Toaster } from "@/components/ui/toaster";
import NonSsr from "@/components/non-ssr";
import { CSPostHogProvider } from "./providers";
import Script from "next/script";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "FakePaper.app",
  description: "Generate realistic-looking joke research papers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Generate realistic-looking joke research papers."
        />
        <meta
          name="keywords"
          content="joke research papers, fake papers, realistic papers, humor, parody"
        />
        <meta name="author" content="Your Name" />

        <meta property="og:title" content="Fake Papers" />
        <meta
          property="og:description"
          content="Generate realistic-looking joke research papers."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_URL}`} />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_URL}/moon.png`}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fake Papers" />
        <meta
          name="twitter:description"
          content="Generate realistic-looking joke research papers."
        />

        <meta
          name="twitter:image"
          content={`${process.env.NEXT_PUBLIC_URL}/moon.png`}
        />

        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://fakepaper.app" />

        <title>Fake Papers</title>

        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
  data-name="BMC-Widget"
  data-cfasync="false"
  src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
  data-id="noahross"
  data-description="Support me on Buy me a coffee!"
  data-message=""
  data-color="#FFDD00"
  data-position="Left"
  data-x_margin="18"
  data-y_margin="18"
  style={{ bottom: '18px', left: '18px', position: 'fixed' }}
></script>
      </head>
      <CSPostHogProvider>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <Shell>
            <div className="mx-2 md:mx-0">{children}</div>
          </Shell>
          <Toaster />
        </body>
      </CSPostHogProvider>
    </html>
  );
}
