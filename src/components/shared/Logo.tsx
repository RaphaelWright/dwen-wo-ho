import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "black" | "purple";
  className?: string;
  withLink?: boolean;
}

export const Logo = ({
  variant = "purple",
  className,
  withLink = true,
}: LogoProps) => {
  const src =
    variant === "black" ? "/logos/logo-black.png" : "/logos/logo-purple.png";

  const content = (
    <Image
      priority
      src={src}
      alt="JustGo Health"
      className={cn("bg-contain w-auto h-auto", className)}
      width={180}
      height={40}
    />
  );

  if (withLink) {
    return (
      <Link href="/" className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
};
