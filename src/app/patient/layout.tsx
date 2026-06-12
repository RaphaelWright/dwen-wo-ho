import Image from "next/image";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex h-screen w-full overflow-hidden">
      <section className="bg-accent hidden h-full w-1/2 md:block">
        <Image
          src="/auth/worried-lady.png"
          alt="worried-lady"
          width={1080}
          height={1080}
          quality={100}
          priority
        />
      </section>
      <section className="h-full w-full overflow-y-auto md:w-1/2">
        {children}
      </section>
    </main>
  );
};

export default Layout;
