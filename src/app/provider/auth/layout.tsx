import Image from "next/image";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col lg:flex-row w-full h-screen overflow-hidden">
      <section className="h-full overflow-hidden hidden lg:block w-1/2 relative">
        <div className="absolute inset-0 bg-teal-600/10 z-10" />
        <Image
          src="/auth/mental-health-2.png"
          alt="mental-health"
          width={1080}
          height={1080}
          quality={100}
          className="w-full h-full object-cover"
        />
      </section>
      <section className="h-full w-full lg:w-1/2 overflow-y-auto bg-background">
        {children}
      </section>
    </main>
  );
};

export default Layout;
