import type { Dispatch, KeyboardEvent, SetStateAction } from "react";

export interface SearchableSelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string | null;
  items: readonly string[];
}

export interface EmojiStatusFieldProps {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}
