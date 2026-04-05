"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/constants/routes";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <Logo />
        </motion.div>

        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="mb-8 relative"
        >
          <h1 className="text-[10rem] md:text-[14rem] font-bold leading-none tracking-tighter text-destructive/80 drop-shadow-sm select-none">
            404
          </h1>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-5 tracking-tight">
            Oops! Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            It looks like you've wandered off the path. The page you're looking
            for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-5 justify-center items-center"
        >
          <Button
            onClick={() => router.push("/")}
            size="lg"
            className="group relative overflow-hidden text-white px-8 h-14 rounded-full text-base font-semibold shadow-[0_8px_30px_rgb(149,90,164,0.3)] hover:shadow-[0_8px_40px_rgb(149,90,164,0.4)] hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Home className=" text-white w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
              Return Home
            </span>
          </Button>
          <Button
            onClick={() => router.back()}
            size="lg"
            variant="outline"
            className="group px-8 h-14 rounded-full text-base font-semibold border-2 border-border bg-background/50 shadow-xs hover:shadow-md transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
          >
            <span className="flex items-center justify-center gap-2">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              Go Back
            </span>
          </Button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 pt-8 border-t border-border"
        >
          <p className="text-sm font-medium text-muted-foreground mb-5 uppercase tracking-wider">
            You might be looking for
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-medium">
            <Button
              variant={"link"}
              onClick={() => router.push(ROUTES.public.landing)}
              className="text-muted-foreground hover:text-destructive/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              Home
            </Button>
            <span className="text-muted-foreground">•</span>
            <Button
              variant={"link"}
              onClick={() => router.push(ROUTES.patient.lockIn)}
              className="text-muted-foreground hover:text-destructive/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              Patient Lock-In
            </Button>
            <span className="text-muted-foreground">•</span>
            <Button
              variant={"link"}
              onClick={() => router.push(ROUTES.provider.auth)}
              className="text-muted-foreground hover:text-destructive/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              Provider Login
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
