import { ReactNode } from "react";
import { NotificationProvider } from "@/context/notification-context";

const CuratorLayout = ({ children }: { children: ReactNode }) => {
  return (
    <NotificationProvider>
      <main className="w-full min-h-screen">{children}</main>
    </NotificationProvider>
  );
};

export default CuratorLayout;
