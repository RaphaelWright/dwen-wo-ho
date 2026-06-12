"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import type { CuratorPagesContentProps } from "@/lib/types/components/curator/content-pages";

export default function CuratorPagesContent({
  pages,
}: CuratorPagesContentProps) {
  const {
    activeTab,
    selectedSchool,
    setShowSchoolModal,
    coverPages: displayCoverPages,
    icons: displayIcons,
    handleCoverPageClick,
    handleIconClick,
    openAddCoverPage,
    openAddIcon,
  } = pages;

  return (
    <>
      {activeTab === "cover-page" && (
        <>
          {displayCoverPages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <h2 className="text-muted-foreground text-center text-[70px] leading-tight font-extrabold">
                Nothing to see yet.
              </h2>
              <p className="text-foreground mt-6 flex items-center gap-2 text-lg">
                You can
                <button
                  type="button"
                  onClick={openAddCoverPage}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 py-2 font-semibold transition"
                >
                  + A D D
                </button>
                a new cover page.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-col items-center justify-center">
                <p className="mb-2 text-lg">
                  You can{" "}
                  <button
                    type="button"
                    onClick={openAddCoverPage}
                    className="bg-foreground text-background hover:bg-foreground/80 rounded-full px-4 py-1.5 font-semibold transition-colors"
                  >
                    + ADD
                  </button>{" "}
                  a new cover page.
                </p>
              </div>
              <div className="space-y-6">
                {displayCoverPages.map((page) => (
                  <button
                    type="button"
                    key={page.id}
                    onClick={() => handleCoverPageClick(page)}
                    className="border-primary hover:border-primary/70 relative w-full cursor-pointer overflow-hidden rounded-xl border-2 transition-all"
                  >
                    <div
                      className="relative h-96 w-full"
                      style={{ backgroundColor: `#${page.color}` }}
                    >
                      {page.photoPreview && (
                        <Image
                          src={page.photoPreview}
                          alt="Cover page"
                          width={600}
                          height={400}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    {page.slogan && (
                      <div className="from-foreground/70 absolute right-0 bottom-0 left-0 bg-linear-to-t to-transparent p-6">
                        <p className="text-background text-2xl font-bold">
                          {page.slogan}
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {activeTab === "lock-ins" && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-foreground mb-2 text-xl font-semibold">
              No lock-ins available
            </p>
            <p className="text-muted-foreground">
              Lock-ins are not available at the moment.
            </p>
          </div>
        </div>
      )}

      {activeTab === "icons" && (
        <>
          {displayIcons.length === 0 ? (
            <div className="flex min-h-50 flex-col items-center justify-center py-2">
              <p className="text-muted-foreground text-[70px] font-bold">
                Nothing to see yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {displayIcons
                .sort((a, b) => a.rank - b.rank)
                .map((icon) => (
                  <button
                    type="button"
                    key={icon.id}
                    onClick={() => handleIconClick(icon)}
                    className="group relative h-96 overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl"
                  >
                    {icon.photoPreview ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={icon.photoPreview}
                          alt={icon.name}
                          width={600}
                          height={400}
                          className="h-full w-full rounded-lg object-contain"
                        />
                        <div className="bg-background border-foreground absolute top-4 left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border-2">
                          <span className="text-foreground text-lg font-bold">
                            #{icon.rank}
                          </span>
                        </div>
                        <div className="from-foreground/70 absolute right-0 bottom-0 left-0 flex flex-col items-center justify-end bg-linear-to-t to-transparent p-6 text-center">
                          <p className="text-background text-3xl font-bold">
                            {icon.name}
                          </p>
                          <div className="mt-2 flex flex-col items-center gap-1">
                            {(icon.lockIns || []).length > 0 ? (
                              (icon.lockIns || []).map((item) => (
                                <span
                                  key={item}
                                  className="text-background/90 flex items-center gap-1.5 text-sm"
                                >
                                  <Lock className="text-warning h-3.5 w-3.5 shrink-0" />
                                  {item}
                                </span>
                              ))
                            ) : (
                              <span className="text-background/70 text-sm">
                                No lock-ins
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-muted flex h-full w-full items-center justify-center">
                        <p className="text-muted-foreground">{icon.name}</p>
                      </div>
                    )}
                  </button>
                ))}
            </div>
          )}

          <div className="mb-2 flex flex-col items-center justify-center">
            <p className="text-foreground mb-2 text-lg">
              You can{" "}
              <button
                type="button"
                onClick={openAddIcon}
                className="bg-foreground text-background hover:bg-foreground/80 rounded-full px-3 py-1.5 font-semibold transition-colors"
              >
                + A D D
              </button>{" "}
              new Icons.
            </p>
          </div>
        </>
      )}

      {(activeTab === "cover-page" || activeTab === "icons") && (
        <div className="relative top-2 mt-4 flex justify-center">
          <div className="origin-center scale-[1.4]">
            <Button
              onClick={() => setShowSchoolModal(true)}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full px-8 py-3 text-lg font-semibold shadow-lg"
            >
              {selectedSchool ? `${selectedSchool.name} >` : "Select school >"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
