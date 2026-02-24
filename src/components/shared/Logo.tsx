import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoProps } from "@/lib/types/shared-ui";

export const Logo = ({
  variant = "purple",
  className,
  withLink = true,
  href = "/",
}: LogoProps) => {
  let content;

  if (variant === "auto") {
    content = (
      <>
        <Image
          priority
          src="/logos/logo-black.png"
          alt="JustGo Health"
          className={cn(
            "bg-contain w-auto h-auto hover:scale-95 transition-all duration-300 ease-in-out dark:hidden",
            className,
          )}
          width={180}
          height={40}
        />
        <Image
          priority
          src="/logos/logo-white.png"
          alt="JustGo Health"
          className={cn(
            "bg-contain w-auto h-auto hover:scale-95 transition-all duration-300 ease-in-out hidden dark:block",
            className,
          )}
          width={180}
          height={40}
        />
      </>
    );
  } else {
    const src =
      variant === "black"
        ? "/logos/logo-black.png"
        : variant === "white"
          ? "/logos/logo-white.png"
          : "/logos/logo-purple.png";

    content = (
      <Image
        priority
        src={src}
        alt="JustGo Health"
        className={cn(
          "bg-contain w-auto h-auto hover:scale-95 transition-all duration-300 ease-in-out",
          className,
        )}
        width={180}
        height={40}
      />
    );
  }

  if (withLink) {
    return (
      <Link href={href as any} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
};
