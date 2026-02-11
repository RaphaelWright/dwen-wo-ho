import { ReactNode } from "react";
import { NotificationProvider } from "@/context/notification-context";

interface IProps {
  children: ReactNode;
}

const CuratorLayout = ({ children }: IProps) => {
  return (
    <NotificationProvider>
      <main className="w-full min-h-screen">{children}</main>
    </NotificationProvider>
  );
};

export default CuratorLayout;
