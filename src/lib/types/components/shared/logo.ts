import { Route } from "next";

export interface LogoProps {
  variant?: "black" | "purple" | "white" | "auto";
  className?: string;
  withLink?: boolean;
  href?: string | Route;
}
