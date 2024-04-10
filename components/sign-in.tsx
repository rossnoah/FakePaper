/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/2kfw9xQbiLn
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { JSX, SVGProps } from "react";

//TODO : implement sign in

export function SignIn() {
  return (
    <div className="mx-auto max-w-[350px] space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign In</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your information to sign in
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="someone@example.com" type="email" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Label className="flex-1" htmlFor="password">
            Password
          </Label>
          <Link className="text-sm underline" href="#">
            Forgot your password?
          </Link>
        </div>
        <Input id="password" type="password" />
      </div>
      <Button className="w-full">Sign In</Button>
      <Separator className="my-8" />
      <div className="space-y-4">
        <Button className="w-full" variant="outline">
          Sign in with Google
          <span className="sr-only">Sign in with Google</span>
          <StarIcon className="w-4 h-4 ml-2" />
        </Button>
        <Button className="w-full" variant="outline">
          Sign in with Apple
          <span className="sr-only">Sign in with Apple</span>
          <StarIcon className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function StarIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
