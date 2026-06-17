"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import type { Dispatch, SetStateAction } from "react";
import { ROUTES } from "@/lib/constants/routes";
import type {
  CampusDraft,
  CreativeStudiosFlowContextValue,
  CreativeStudiosType,
  PreviewPanelProps,
  ProgrammeDraft,
  ProviderDraft,
  TagDraft,
} from "@/lib/types/components/curator/create/creative-studios";
import { useCreativeStudiosMockStore } from "@/hooks/components/curator/create/use-creative-studios-mock-store";
import { revokeObjectUrl } from "@/lib/utils/shared/revoke-object-url";

const DEFAULT_CAMPUS: CampusDraft = {
  name: "",
  nicks: [],
  motto: "",
  type: "",
  loc: "",
  logoUrl: null,
  photoUrl: null,
};

const DEFAULT_PROVIDER: ProviderDraft = {
  name: "",
  nicks: [],
  bio: "",
  clin: false,
  photoUrl: null,
};

const DEFAULT_PROGRAMME: ProgrammeDraft = {
  name: "",
  nicks: [],
  bio: "",
  df: 1,
  dt: 52,
  coverUrl: null,
};

const DEFAULT_TAG: TagDraft = {
  title: "",
  tags: [],
};

export function useCreativeStudiosFlow(
  type: CreativeStudiosType,
  drafts: {
    campus: CampusDraft;
    provider: ProviderDraft;
    programme: ProgrammeDraft;
    tag: TagDraft;
  },
  setDrafts: Dispatch<
    SetStateAction<{
      campus: CampusDraft;
      provider: ProviderDraft;
      programme: ProgrammeDraft;
      tag: TagDraft;
    }>
  >,
): CreativeStudiosFlowContextValue {
  const router = useRouter();
  const { addCampus, addProvider, addProgramme, addTag } =
    useCreativeStudiosMockStore();

  const preview = useMemo((): PreviewPanelProps => {
    switch (type) {
      case "campus":
        return {
          name: drafts.campus.name || "Campus Name",
          nick: drafts.campus.nicks[0] || "",
          type: drafts.campus.type,
          loc: drafts.campus.loc,
          motto: drafts.campus.motto,
          logoUrl: drafts.campus.logoUrl,
          photoUrl: drafts.campus.photoUrl,
        };
      case "provider":
        return {
          name: drafts.provider.name || "Provider Name",
          nick: drafts.provider.nicks[0] || "",
          logoUrl: drafts.provider.photoUrl,
        };
      case "programme":
        return {
          name: drafts.programme.name || "Programme Name",
          nick: drafts.programme.nicks[0] || "",
          photoUrl: drafts.programme.coverUrl,
        };
      case "tag":
        return { name: drafts.tag.title || "Tag Title" };
      default:
        return { name: "—" };
    }
  }, [type, drafts]);

  const updateCampus = (partial: Partial<CampusDraft>) => {
    setDrafts((prev) => ({ ...prev, campus: { ...prev.campus, ...partial } }));
  };

  const updateProvider = (partial: Partial<ProviderDraft>) => {
    setDrafts((prev) => ({
      ...prev,
      provider: { ...prev.provider, ...partial },
    }));
  };

  const updateProgramme = (partial: Partial<ProgrammeDraft>) => {
    setDrafts((prev) => ({
      ...prev,
      programme: { ...prev.programme, ...partial },
    }));
  };

  const updateTag = (partial: Partial<TagDraft>) => {
    setDrafts((prev) => ({ ...prev, tag: { ...prev.tag, ...partial } }));
  };

  const resetDrafts = () => {
    revokeObjectUrl(drafts.campus.logoUrl);
    revokeObjectUrl(drafts.campus.photoUrl);
    revokeObjectUrl(drafts.provider.photoUrl);
    revokeObjectUrl(drafts.programme.coverUrl);
    setDrafts({
      campus: { ...DEFAULT_CAMPUS },
      provider: { ...DEFAULT_PROVIDER },
      programme: { ...DEFAULT_PROGRAMME },
      tag: { ...DEFAULT_TAG },
    });
  };

  const submitCampus = () => {
    addCampus({
      name: drafts.campus.name.trim(),
      nicks: [...drafts.campus.nicks],
      motto: drafts.campus.motto,
      type: drafts.campus.type,
      loc: drafts.campus.loc,
    });
    resetDrafts();
    router.push(ROUTES.curator.create as Route);
  };

  const submitProvider = () => {
    addProvider({
      name: drafts.provider.name.trim(),
      nicks: [...drafts.provider.nicks],
      bio: drafts.provider.bio,
      clin: drafts.provider.clin,
    });
    resetDrafts();
    router.push(ROUTES.curator.create as Route);
  };

  const submitProgramme = () => {
    addProgramme({
      name: drafts.programme.name.trim(),
      nicks: [...drafts.programme.nicks],
      bio: drafts.programme.bio,
      df: drafts.programme.df,
      dt: drafts.programme.dt,
    });
    resetDrafts();
    router.push(ROUTES.curator.create as Route);
  };

  const submitTag = () => {
    addTag({ title: drafts.tag.title.trim() });
    resetDrafts();
    router.push(ROUTES.curator.create as Route);
  };

  return {
    type,
    campus: drafts.campus,
    provider: drafts.provider,
    programme: drafts.programme,
    tag: drafts.tag,
    preview,
    updateCampus,
    updateProvider,
    updateProgramme,
    updateTag,
    submitCampus,
    submitProvider,
    submitProgramme,
    submitTag,
    resetDrafts,
  };
}

export const CREATIVE_STUDIOS_DEFAULT_DRAFTS = {
  campus: DEFAULT_CAMPUS,
  provider: DEFAULT_PROVIDER,
  programme: DEFAULT_PROGRAMME,
  tag: DEFAULT_TAG,
};
