import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Brain,
  Book,
  Bot,
  Settings,
  CreditCard,
  LogOut,
  Sparkles,
  Flower,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define types for the component's expected data structure
export type MenuItem = {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
};

export type MenuSection = {
  title: string;
  items: MenuItem[];
};

export type UserProfile = {
  name: string;
  status: string;
  avatarUrl?: string;
  avatarFallback?: string;
};

export type FooterActions = {
  signOut?: {
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
  };
  primaryAction?: {
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
  };
};

export type ProfileMenuClassNames = {
  root?: string;
  card?: string;
  header?: string;
  headerLogo?: string;
  headerCloseButton?: string;
  avatarContainer?: string;
  avatarImage?: string;
  avatarName?: string;
  avatarStatus?: string;
  menuBody?: string;
  menuSection?: string;
  menuSectionTitle?: string;
  menuItem?: string;
  menuItemActive?: string;
  menuItemInactive?: string;
  menuItemIcon?: string;
  divider?: string;
  footer?: string;
  signOutButton?: string;
  bottomButtons?: string;
  primaryButton?: string;
  secondaryButton?: string;
};

export type ProfileMenuProps = {
  user?: UserProfile;
  menuSections?: MenuSection[];
  logo?: ReactNode | string;
  footerActions?: FooterActions;
  classNames?: ProfileMenuClassNames;
  initialActiveItem?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
};

// Default Values
const defaultUser: UserProfile = {
  name: "Shinomiya Kaguya",
  status: "You are being mindful.",
  avatarUrl: "https://github.com/shadcn.png",
  avatarFallback: "CN",
};

const defaultLogo = (
  <>
    <Flower size={20} className="w-5 h-5" strokeWidth={2} />
    <span className="text-lg font-semibold tracking-tight">App Logo</span>
  </>
);

const defaultMenuSections: MenuSection[] = [
  {
    title: "General",
    items: [
      {
        label: "Mental Health Metrics",
        icon: <Brain size={18} strokeWidth={1.8} />,
      },
      { label: "Journaling", icon: <Book size={18} strokeWidth={1.8} /> },
      {
        label: "Personal AI Assistant",
        icon: <Bot size={18} strokeWidth={1.8} />,
      },
    ],
  },
  {
    title: "Profile",
    items: [
      { label: "Settings", icon: <Settings size={18} strokeWidth={1.8} /> },
      {
        label: "Subscription",
        icon: <CreditCard size={18} strokeWidth={1.8} />,
      },
    ],
  },
];

const defaultFooterActions: FooterActions = {
  signOut: {
    label: "Sign Out",
    icon: <LogOut size={16} strokeWidth={1.8} />,
  },
  primaryAction: {
    label: "Go Pro",
    icon: <Sparkles size={14} strokeWidth={2} />,
  },
  secondaryAction: {
    label: "Rate Our App",
  },
};

export function MobileMenuSheet({
  user = defaultUser,
  menuSections = defaultMenuSections,
  logo = defaultLogo,
  footerActions = defaultFooterActions,
  classNames = {},
  initialActiveItem = "Journaling",
  open = true,
  onOpenChange,
  onClose,
}: ProfileMenuProps) {
  const [active, setActive] = useState(initialActiveItem);

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange?.(isOpen);
    if (!isOpen) {
      onClose?.();
    }
  };

  const handleClose = () => {
    handleOpenChange(false);
  };

  const menuItem = (item: MenuItem) => {
    const isActive = active === item.label;
    return (
      <div
        key={item.label}
        onClick={() => {
          setActive(item.label);
          item.onClick?.();
        }}
        className={cn(
          "flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-150 text-sm tracking-tight border ",
          isActive
            ? cn(
                "font-medium bg-secondary text-secondary-foreground border-border",
                classNames.menuItemActive,
              )
            : cn(
                "font-normal border-transparent hover:bg-muted text-foreground",
                classNames.menuItemInactive,
              ),
          classNames.menuItem,
        )}
      >
        <span className={cn("opacity-70", classNames.menuItemIcon)}>
          {item.icon}
        </span>
        {item.label}
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className={cn(
          "w-80 p-0 border-r-0 sm:max-w-xs flex flex-col items-stretch overflow-hidden rounded-r-3xl bg-background",
          classNames.root,
          classNames.card,
        )}
        showCloseButton={false}
      >
        <SheetTitle className="sr-only">
          Profile Menu Main Navigation
        </SheetTitle>
        {/* Header */}
        <div
          className={cn(
            "bg-primary px-5 pt-5 pb-10 relative rounded-[0_0_50%_50%/0_0_40px_40px] shrink-0",
            classNames.header,
          )}
        >
          {/* Logo */}
          <div className="flex items-center justify-between mb-5">
            <div
              className={cn(
                "flex items-center gap-2 text-primary-foreground",
                classNames.headerLogo,
              )}
            >
              {typeof logo === "string" ? (
                <span className="text-lg font-semibold tracking-tight">
                  {logo}
                </span>
              ) : (
                logo
              )}
            </div>
            <button
              onClick={handleClose}
              className={cn(
                "bg-primary-foreground/15 border-none rounded-full w-7 h-7 flex items-center justify-center text-primary-foreground cursor-pointer hover:bg-primary-foreground/20 transition-colors focus:outline-none focus:ring-0",
                classNames.headerCloseButton,
              )}
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Avatar */}
          <div className={cn("text-center", classNames.avatarContainer)}>
            <Avatar
              className={cn(
                "w-16 h-16 mx-auto mb-3 border-4 border-background/30 rounded-full",
                classNames.avatarImage,
              )}
            >
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-secondary text-2xl flex items-center justify-center">
                {user.avatarFallback || user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "text-primary-foreground text-lg font-bold mb-1",
                classNames.avatarName,
              )}
            >
              {user.name}
            </div>
            <div
              className={cn(
                "text-primary-foreground/70 text-sm italic",
                classNames.avatarStatus,
              )}
            >
              {user.status}
            </div>
          </div>
        </div>

        {/* Menu Body */}
        <div
          className={cn(
            "px-4 py-6 bg-background flex-1 flex flex-col overflow-hidden",
            classNames.menuBody,
          )}
        >
          <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-2 pt-1">
            {menuSections.map((section, index) => (
              <div key={section.title} className={classNames.menuSection}>
                <div className="mb-5 flex flex-col gap-1">
                  <div
                    className={cn(
                      "text-xs font-semibold tracking-widest uppercase px-3.5 mb-2 text-muted-foreground",
                      classNames.menuSectionTitle,
                    )}
                  >
                    {section.title}
                  </div>
                  {section.items.map((item) => menuItem(item))}
                </div>
                {/* Divider (except after the last section) */}
                {index < menuSections.length - 1 && (
                  <div
                    className={cn(
                      "h-px w-full my-1 mb-5 bg-border",
                      classNames.divider,
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div
            className={cn(
              "h-px w-full my-1 mb-4 bg-border mt-auto shrink-0",
              classNames.divider,
            )}
          />

          <div className={cn("shrink-0", classNames.footer)}>
            {/* Sign Out */}
            {footerActions.signOut && (
              <button
                onClick={footerActions.signOut.onClick}
                className={cn(
                  "flex items-center gap-2.5 px-3.5 py-2.5 bg-transparent border-none cursor-pointer text-destructive text-sm tracking-tight rounded-xl transition-colors duration-150 w-full hover:bg-destructive/10",
                  classNames.signOutButton,
                )}
              >
                {footerActions.signOut.icon}
                {footerActions.signOut.label}
              </button>
            )}

            {/* Bottom Buttons */}
            {(footerActions.primaryAction || footerActions.secondaryAction) && (
              <div
                className={cn(
                  "flex gap-2.5 mt-5 px-0.5",
                  classNames.bottomButtons,
                )}
              >
                {footerActions.primaryAction && (
                  <button
                    onClick={footerActions.primaryAction.onClick}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 p-3 rounded-full border-none bg-primary text-primary-foreground text-sm font-semibold cursor-pointer tracking-tight shadow-md transition-all duration-150 hover:-translate-y-px hover:shadow-lg",
                      classNames.primaryButton,
                    )}
                  >
                    {footerActions.primaryAction.label}{" "}
                    {footerActions.primaryAction.icon}
                  </button>
                )}
                {footerActions.secondaryAction && (
                  <button
                    onClick={footerActions.secondaryAction.onClick}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 p-3 rounded-full border border-input text-sm font-medium cursor-pointer tracking-tight transition-transform duration-150 hover:-translate-y-px bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
                      classNames.secondaryButton,
                    )}
                  >
                    {footerActions.secondaryAction.label}{" "}
                    {footerActions.secondaryAction.icon}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
