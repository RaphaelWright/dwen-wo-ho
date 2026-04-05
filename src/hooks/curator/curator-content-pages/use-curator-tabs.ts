"use client";

import { useState } from "react";

export type CuratorPagesTabType = "cover-page" | "icons" | "lock-ins";

export function useCuratorTabs() {
  const [activeTab, setActiveTab] = useState<CuratorPagesTabType>("cover-page");

  const tabs = [
    { id: "cover-page" as CuratorPagesTabType, label: "Cover Page" },
    { id: "icons" as CuratorPagesTabType, label: "Icons" },
    { id: "lock-ins" as CuratorPagesTabType, label: "Lock-ins" },
  ];

  return {
    activeTab,
    setActiveTab,
    tabs,
  };
}
