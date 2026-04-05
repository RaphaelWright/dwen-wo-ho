import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Play,
  MoreHorizontal,
  Brain,
  Book,
  Bot,
  Settings,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */

export type RevealMenuUser = {
  name: string;
  role: string;
  avatarUrl?: string;
  avatarFallback?: string;
};

export type RevealMenuAction = {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
};

export type RevealMenuFeatured = {
  title: string;
  subtitle: string;
  status: string;
  icon: ReactNode;
  onClick?: () => void;
};

export type RevealMenuCard = {
  icon: ReactNode;
  label: string;
  gradient: string;
  onClick?: () => void;
};

export type RevealMenuListItem = {
  name: string;
  subtitle: string;
  icon: ReactNode;
  gradient: string;
  onClick?: () => void;
};

export type MobileRevealMenuProps = {
  /** The main application content that gets pushed aside */
  children: ReactNode;
  /** Controls if the menu is popped open */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Custom data for the drawer */
  user?: RevealMenuUser;
  actions?: {
    primary?: RevealMenuAction;
    secondary?: RevealMenuAction;
  };
  featured?: RevealMenuFeatured;
  cardSection?: {
    title: string;
    items: RevealMenuCard[];
  };
  listSection?: {
    title: string;
    items: RevealMenuListItem[];
  };
  classNames?: {
    drawer?: string;
    appWrapper?: string;
  };
};

/* ═══════════════════════════════════════════════════════════════
   Defaults
   ═══════════════════════════════════════════════════════════════ */

const defaultUser: RevealMenuUser = {
  name: "Shinomiya Kaguya",
  role: "You are being mindful.",
  avatarUrl: "https://github.com/shadcn.png",
  avatarFallback: "CN",
};

const defaultActions = {
  primary: { label: "Go Pro", icon: <Sparkles size={14} strokeWidth={2} /> },
  secondary: { label: "Rate Our App" },
};

const defaultFeatured: RevealMenuFeatured = {
  title: "Personal AI Assistant",
  subtitle: "Always here to help",
  status: "Online",
  icon: <Bot size={16} strokeWidth={1.8} className="text-white opacity-80" />,
};

const defaultCardSection = {
  title: "General",
  items: [
    {
      icon: <Brain size={26} strokeWidth={1.8} className="text-white" />,
      label: "Mental Health Metrics",
      gradient: "linear-gradient(135deg,#1a1a2e,#2d2d44)",
    },
    {
      icon: <Book size={26} strokeWidth={1.8} className="text-white" />,
      label: "Journaling",
      gradient: "linear-gradient(135deg,#2a1a0e,#4a3a2e)",
    },
  ],
};

const defaultListSection = {
  title: "Profile",
  items: [
    {
      name: "Settings",
      subtitle: "Preferences & Security",
      icon: <Settings size={18} strokeWidth={1.8} className="text-white" />,
      gradient: "linear-gradient(135deg,#ff6b6b,#ffd93d)",
    },
    {
      name: "Subscription",
      subtitle: "Manage your plan",
      icon: <CreditCard size={18} strokeWidth={1.8} className="text-white" />,
      gradient: "linear-gradient(135deg,#a18cd1,#fbc2eb)",
    },
    {
      name: "Sign Out",
      subtitle: "See you soon!",
      icon: <LogOut size={18} strokeWidth={1.8} className="text-white" />,
      gradient: "linear-gradient(135deg,#1a1a2e,#2d1a2e)",
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════
   Internal Components
   ═══════════════════════════════════════════════════════════════ */

const Waveform = () => {
  const bars = Array.from({ length: 38 }, (_, i) => ({
    h: Math.max(4, Math.sin(i * 0.55) * 10 + Math.sin(i * 1.3) * 7 + 13),
    lit: i < 14,
  }));
  return (
    <div className="flex items-center gap-0.5 h-6.5">
      {bars.map((b, i) => (
        <div
          key={i}
          className={cn(
            "w-0.75 rounded-sm transition-all",
            b.lit ? "bg-primary" : "bg-primary/20",
          )}
          style={{ height: `${b.h}px` }}
        />
      ))}
    </div>
  );
};

export function MobileRevealMenu({
  children,
  open,
  user = defaultUser,
  actions = defaultActions,
  featured = defaultFeatured,
  cardSection = defaultCardSection,
  listSection = defaultListSection,
  classNames = {},
}: MobileRevealMenuProps) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-background">
      {/* ── Drawer Layer (Bottom) ── */}
      <div
        className={cn(
          "absolute top-0 left-0 w-[78%] h-full bg-background transition-transform duration-400 ease-in-out flex flex-col overflow-hidden z-10",
          open ? "translate-x-0" : "-translate-x-full",
          classNames.drawer,
        )}
      >
        <div className="shrink-0 flex flex-col">
          {/* Drawer Hero */}
          <div
            className="h-42.5 relative bg-primary text-primary-foreground overflow-hidden"
            style={{
              clipPath:
                "path('M 0 0 L 265 0 L 265 170 L 179 170 A 47 47 0 0 1 85 170 L 0 170 Z')",
            }}
          >
            {/* Decorative Stars */}
            {[...Array(28)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: Math.random() * 2 + 1 + "px",
                  height: Math.random() * 2 + 1 + "px",
                  top: Math.random() * 90 + "%",
                  left: Math.random() * 100 + "%",
                  opacity: Math.random() * 0.4 + 0.1,
                }}
              />
            ))}
            {/* Glowing Accents */}
            <div className="absolute top-3 left-[15%] right-0 h-13.75 -rotate-12 blur-[9px] bg-white/10" />
            <div className="absolute top-9 left-[5%] right-[25%] h-8.75 -rotate-6 blur-[5px] bg-white/5" />
          </div>

          {/* Avatar positioned in the notch */}
          <div className="flex justify-center -mt-11.75 relative z-20">
            <Avatar className="w-22.5 h-22.5 border-4 border-background p-0.5 shadow-lg">
              <div className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden bg-secondary">
                <AvatarImage
                  src={user.avatarUrl}
                  alt={user.name}
                  className="absolute inset-1 rounded-full w-auto h-auto object-cover"
                />
                <AvatarFallback className="w-full h-full bg-secondary text-secondary-foreground flex items-center justify-center text-3xl font-semibold">
                  {user.avatarFallback || user.name.charAt(0)}
                </AvatarFallback>
              </div>
            </Avatar>
          </div>

          {/* Profile Info */}
          <div className="text-center px-4 pt-2.5">
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              {user.name}
            </h2>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              {user.role}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 px-4 pt-4 pb-4 border-b border-border/50">
            {actions?.primary && (
              <button
                onClick={actions.primary.onClick}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full border border-transparent bg-primary text-primary-foreground font-semibold text-xs cursor-pointer shadow-md transition-transform hover:scale-105"
              >
                {actions.primary.label} {actions.primary.icon}
              </button>
            )}
            {actions?.secondary && (
              <button
                onClick={actions.secondary.onClick}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full border border-input bg-background text-foreground font-medium text-xs cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground shadow-sm"
              >
                {actions.secondary.label} {actions.secondary.icon}
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Items Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-6 pt-3 px-3.5 space-y-6">
          {/* Featured Widget (e.g. AI Assistant) */}
          {featured && (
            <div
              className="bg-accent/50 border border-primary/10 rounded-2xl p-3 cursor-pointer hover:bg-accent transition-colors shadow-sm"
              onClick={featured.onClick}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                  {featured.icon}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-semibold text-sm text-foreground truncate">
                    {featured.title}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {featured.subtitle}
                  </div>
                </div>
                <div className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {featured.status}
                </div>
              </div>
              <Waveform />
            </div>
          )}

          {/* Horizontal Cards section */}
          {cardSection && cardSection.items.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3 pl-1">
                {cardSection.title}
              </h3>
              <div className="flex gap-2.5">
                {cardSection.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-2xl relative h-28 overflow-hidden group cursor-pointer shadow-sm border border-border/40"
                    style={{ background: item.gradient }}
                    onClick={item.onClick}
                  >
                    <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60 transition-transform duration-300 group-hover:scale-110 group-hover:opacity-100">
                      {item.icon}
                    </div>
                    <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Play
                        size={12}
                        className="text-white ml-0.5"
                        fill="currentColor"
                      />
                    </div>
                    <div className="absolute bottom-2.5 left-2 right-2 text-white text-[11px] text-center font-medium leading-tight whitespace-pre-wrap px-1 drop-shadow-sm">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vertical List section */}
          {listSection && listSection.items.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3 pl-1">
                {listSection.title}
              </h3>
              <div className="flex flex-col gap-1.5">
                {listSection.items.map((item, i) => (
                  <div
                    key={i}
                    onClick={item.onClick}
                    className="flex items-center gap-3.5 p-3 rounded-xl bg-card border border-border/40 cursor-pointer hover:border-primary/20 hover:bg-accent/50 transition-all shadow-sm"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-inner"
                      style={{ background: item.gradient }}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="font-semibold text-sm text-foreground truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {item.subtitle}
                      </div>
                    </div>
                    <MoreHorizontal
                      size={18}
                      className="text-muted-foreground/50 shrink-0 group-hover:text-primary transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── App Content Layer (Top) ── */}
      <div
        className={cn(
          "absolute inset-0 bg-background origin-center transition-all duration-400 ease-in-out overflow-hidden flex",
          open
            ? "translate-x-[75%] rounded-3xl scale-90 shadow-[0_20px_60px_rgba(0,0,0,0.2)] z-20 pointer-events-none border border-border/50"
            : "translate-x-0 rounded-none scale-100 shadow-none z-1",
          classNames.appWrapper,
        )}
      >
        {/* Render whatever page content the user places inside the wrapper */}
        {children}
      </div>
    </div>
  );
}
