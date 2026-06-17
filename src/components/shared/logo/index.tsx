import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoProps } from "@/lib/types/components/shared/logo";
import { ROUTES } from "@/lib/constants/routes";
import { Route } from "next";

export const Logo = ({
  variant = "purple",
  className,
  withLink = true,
  href = ROUTES.public.landing as Route,
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
            "-ml-0.5 h-auto w-auto bg-contain transition-all duration-300 ease-in-out hover:scale-95 dark:hidden",
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
            "-ml-0.5 hidden h-auto w-auto bg-contain transition-all duration-300 ease-in-out hover:scale-95 dark:block",
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
          "-ml-0.5 h-auto w-auto bg-contain transition-all duration-300 ease-in-out hover:scale-95",
          className,
        )}
        width={180}
        height={40}
      />
    );
  }

  if (withLink) {
    return (
      <Link href={href as Route} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
};
