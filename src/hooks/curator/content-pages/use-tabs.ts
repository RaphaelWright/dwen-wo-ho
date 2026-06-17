"use client";

import { useState } from "react";

type CuratorPagesTabType = "cover-page" | "icons" | "lock-ins";

const tabs = [
  { id: "cover-page" as CuratorPagesTabType, label: "Cover Page" },
  { id: "icons" as CuratorPagesTabType, label: "Icons" },
  { id: "lock-ins" as CuratorPagesTabType, label: "Lock-ins" },
];

export function useCuratorTabs() {
  const [activeTab, setActiveTab] = useState<CuratorPagesTabType>("cover-page");

  return {
    activeTab,
    setActiveTab,
    tabs,
  };
}
