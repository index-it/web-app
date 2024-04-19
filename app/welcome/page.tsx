"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {Icon} from "@/components/ui/icon";

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4">
      {/* Logo and welcome text */}
      <Image
        src="/logo.png"
        width={500}
        height={500}
        alt="Index logo"
        className="size-20 rounded-2xl shadow-xl border border-border select-none"
        draggable={false}
      />

      <p className="text-2xl font-semibold text-center mt-4">Welcome to Index</p>

      {/* OAuth buttons */}
      <div className="flex flex-col gap-2 mt-8">
        <Button className="gap-2 justify-start">
          <Icon icon="logos:google-icon" className="size-4" />
          Login with Google
        </Button>
        <Button className="gap-2 justify-start">
          <Icon icon="material-symbols:mail-rounded" className="size-4" />
          Login with email
        </Button>
      </div>

      {/* Terms and conditions */}
      <p className="text-xs text-center mt-6">By using Index you agree to our <a href="https://index-it.app/terms" target="_blank" className="text-link">Terms of Service</a> and <a href="https://index-it.app/terms" target="_blank" className="text-link">Privacy Policy.</a></p>
    </div>
  );
}