"use client";

import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils/timeAgo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { activateOnKeyboard } from "@/lib/utils/a11y";

/**
 * A single notification row in the notifications sheet with redesigned card layout.
 */
export default function NotifItem<N>({
  notif,
  isUnread,
  onMarkRead,
  onDelete,
  onClick,
  isMarkingRead = false,
  isDeleting = false,
  getAvatarUrl,
  getEmoji,
  getTitle,
  getText,
  getTimestamp,
}: {
  notif: N;
  isUnread: boolean;
  onMarkRead: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  isMarkingRead?: boolean;
  isDeleting?: boolean;
  getAvatarUrl: (n: unknown) => string | null | undefined;
  getEmoji: (n: unknown) => string | undefined;
  getTitle: (n: unknown) => string | undefined;
  getText: (n: unknown) => string | undefined;
  getTimestamp: (n: unknown) => string | undefined;
}) {
  const avatarUrl = getAvatarUrl(notif);
  const emoji = getEmoji(notif);
  const title = getTitle(notif);
  const text = getText(notif);
  const timestamp = getTimestamp(notif);
  const relativeTime = timeAgo(timestamp);

  const handleActivate = () => {
    if (isUnread) onMarkRead();
    onClick?.();
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        role="button"
        tabIndex={0}
        aria-label={title || "Notification"}
        onClick={handleActivate}
        onKeyDown={activateOnKeyboard(handleActivate)}
        className={cn(
          "relative flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all duration-300 ease-in-out",
          isUnread
            ? "bg-success/15 border-success/20 border-l-3 border-l-success/50 shadow-sm"
            : "bg-muted border-muted",
        )}
      >
        {/* Avatar */}
        <Avatar
          className={cn(
            "size-10 shrink-0 border border-success/20 rounded-md",
            !isUnread && "border-muted-foreground/10",
          )}
        >
          <AvatarImage src={avatarUrl ?? undefined} className="rounded-none" />
          {title || emoji ? (
            <AvatarFallback className="bg-muted dark:bg-muted-foreground/30 dark:text-foreground text-sm rounded-none">
              {emoji ? emoji : (title || "N").charAt(0).toUpperCase()}
            </AvatarFallback>
          ) : (
            <AvatarFallback className="bg-muted dark:bg-muted-foreground/30 dark:text-foreground text-sm rounded-none">
              N
            </AvatarFallback>
          )}
        </Avatar>

        {/* Body */}
        <div className="flex-1 min-w-0">
          {/* Green badge with name/title */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-sm text-xs font-semibold",
                isUnread
                  ? "bg-success text-white"
                  : "bg-muted-foreground/10 text-muted-foreground font-normal",
              )}
            >
              {title || "Notification"}
            </span>
          </div>

          {/* Message text as bold subtitle */}
          <p
            className={cn(
              "text-sm  mb-0.5",
              !isUnread && "font-normal text-muted-foreground",
            )}
          >
            {text}
          </p>

          {/* Meta with dot separator */}
          <p className="text-xs text-muted-foreground">{relativeTime}</p>
        </div>

        {/* Right side: Green dot for unread + Actions */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          {/* Unread indicator dot */}
          {isUnread && <span className="w-2 h-2 rounded-full bg-success" />}

          {/* Actions */}
          <div className={cn("flex flex-col gap-1 mt-1", !isUnread && "mt-5")}>
            {isUnread ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkRead();
                    }}
                    disabled={isMarkingRead}
                    className="flex items-center justify-center w-7 h-7 rounded-md text-success hover:bg-white/70 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isMarkingRead ? (
                      <Spinner className="size-3.5" />
                    ) : (
                      <Check size={16} />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="text-[10px]">Mark as read</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                type="button"
                disabled
                className="flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground/50 cursor-not-allowed"
              >
                <Check size={16} />
              </button>
            )}

            {onDelete && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    disabled={isDeleting}
                    className="flex items-center justify-center w-7 h-7 rounded-md text-destructive hover:bg-destructive/10 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <Spinner className="size-3.5" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="text-[10px]">Delete</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
