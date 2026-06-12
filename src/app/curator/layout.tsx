import { ReactNode } from "react";

const CuratorLayout = ({ children }: { children: ReactNode }) => {
  return <main className="min-h-screen w-full">{children}</main>;
};

export default CuratorLayout;
