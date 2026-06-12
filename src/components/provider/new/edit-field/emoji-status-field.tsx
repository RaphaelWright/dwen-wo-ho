"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { m, AnimatePresence } from "motion/react";
import { Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useClickOutside } from "@/hooks/use-click-outside";
import { EmojiStatusFieldProps } from "@/lib/types/components/provider/edit-field";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export function EmojiStatusField({
  value,
  onChange,
  onKeyDown,
}: EmojiStatusFieldProps) {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  useClickOutside(emojiRef, () => setEmojiOpen(false));

  return (
    <div className="relative mb-2" ref={emojiRef}>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="focus:ring-primary/20 flex-1 focus:ring-1"
          placeholder="Enter status or pick emoji..."
          autoFocus
        />
        <button
          type="button"
          onClick={() => setEmojiOpen(!emojiOpen)}
          className="border-input bg-background hover:bg-accent rounded-md border p-2 transition-colors"
        >
          <Smile size={18} className="text-muted-foreground" />
        </button>
      </div>

      <AnimatePresence>
        {emojiOpen && (
          <m.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2"
          >
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                onChange((prev) => prev + emojiData.emoji);
              }}
              height={350}
              skinTonesDisabled
              previewConfig={{ showPreview: false }}
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
