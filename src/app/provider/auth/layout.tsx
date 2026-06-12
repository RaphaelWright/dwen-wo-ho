import Image from "next/image";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex h-screen w-full flex-col overflow-hidden lg:flex-row">
      <section className="relative hidden h-full w-1/2 overflow-hidden lg:block">
        <div className="bg-destructive/5 absolute inset-0 z-10" />
        <Image
          src="/auth/mental-health-2.png"
          alt="mental-health"
          width={1080}
          height={1080}
          quality={100}
          priority
          className="h-full w-full object-cover"
        />
      </section>
      <section className="bg-background h-full w-full overflow-y-auto lg:w-1/2">
        {children}
      </section>
    </main>
  );
};

export default Layout;
