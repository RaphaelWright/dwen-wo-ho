"use client";

import Image from "next/image";
import { Logo } from "@/components/shared/Logo";
import WidthConstraint from "@/components/ui/width-constraint";
import { useCuratorContentPages } from "@/hooks/curator/curator-content-pages";
import CuratorPagesContent from "@/components/curator/content-pages/curator-pages-content";
import CuratorPagesModals from "@/components/curator/content-pages/curator-pages-modals";

export default function CuratorPagesPage() {
  const pages = useCuratorContentPages();
  const { activeTab, setActiveTab, selectedSchool, tabs } = pages;

  return (
    <WidthConstraint>
      <div className="overflow-x-hidden p-8">
        <div className="mb-8 flex min-h-30 items-center justify-center">
          {selectedSchool ? (
            <div className="mb-6 flex origin-center scale-[1.2] items-center justify-center gap-4">
              {selectedSchool.logo ? (
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border">
                  <Image
                    src={selectedSchool.logo}
                    alt={selectedSchool.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="bg-muted-foreground flex h-16 w-16 items-center justify-center rounded-full">
                  <span className="text-2xl">🏫</span>
                </div>
              )}
              <h1 className="text-success text-3xl font-bold">
                {selectedSchool.name}
              </h1>
            </div>
          ) : (
            <div className="mb-6 flex origin-center scale-[1.2] justify-center">
              <Logo />
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center justify-center gap-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-8 py-3 text-base font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted-foreground text-muted hover:bg-muted"
                } `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <CuratorPagesContent pages={pages} />
        <CuratorPagesModals pages={pages} />
      </div>
    </WidthConstraint>
  );
}
