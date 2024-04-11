import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JSX, SVGProps } from "react";

export function Shell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 py-4 lg:py-8 flex items-center">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <FileTextIcon className="h-8 w-8" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tighter/none">
                FakePaper.app
              </h1>
              <p className="text-xs leading-none text-gray-500 dark:text-gray-400/40">
                Your Source for Academic Satire
              </p>
            </div>
          </div>
        </Link>
        <nav className="ml-auto hidden lg:flex gap-4 lg:gap-6 bg">
          {/* <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="features"
          >
            Features
          </Link> */}
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="generate"
          >
            Generate
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="pricing"
          >
            Pricing
          </Link>
          {/* <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="templates"
          >
            Templates
          </Link> */}
          {/* <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="about"
          >
            About
          </Link> */}
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="contact"
          >
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="tos"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="privacy"
          >
            Privacy
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="contact"
          >
            Contact Us
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function FileTextIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}
