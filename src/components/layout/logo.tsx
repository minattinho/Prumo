import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "white";
}

export function Logo({ className, variant = "default" }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center shrink-0", className)}>
      <Image
        src="/logo.png"
        alt="Prumo"
        width={168}
        height={56}
        className={cn(
          "h-40 w-auto object-contain",
          variant === "white" && "brightness-0 invert"
        )}
        priority
      />
    </Link>
  );
}
