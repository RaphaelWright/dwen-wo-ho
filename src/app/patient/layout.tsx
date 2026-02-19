import Image from "next/image";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex w-full h-screen overflow-hidden">
      <section className="hidden md:block h-full w-1/2 bg-accent">
        <Image
          src="/auth/worried-lady.png"
          alt="worried-lady"
          width={1080}
          height={1080}
          quality={100}
          priority
        />
      </section>
      <section className="h-full w-full md:w-1/2 overflow-y-auto ">
        {children}
      </section>
    </main>
  );
};

export default Layout;
