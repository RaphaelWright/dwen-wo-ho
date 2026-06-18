"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import type { Dispatch, SetStateAction } from "react";
import { DYNAMIC_ROUTES } from "@/lib/constants/routes";
import useCreativeStudiosQuery from "@/hooks/queries/use-creative-studios";
import type {
  CampusDraft,
  CreativeStudiosFlowContextValue,
  CreativeStudiosType,
  PreviewPanelProps,
  ProgrammeDraft,
  ProviderDraft,
  TagDraft,
} from "@/lib/types/components/curator/create/creative-studios";
import { getDefaultProgrammeYears } from "@/lib/utils/curator/create/reconcile-programme-years";
import { revokeObjectUrl } from "@/lib/utils/shared/revoke-object-url";

const defaultProgrammeYears = getDefaultProgrammeYears();

const DEFAULT_CAMPUS: CampusDraft = {
  name: "",
  nicks: [],
  motto: "",
  type: "",
  location: "",
  logoUrl: null,
  photoUrl: null,
  logoFile: null,
  bannerFile: null,
};

const DEFAULT_PROVIDER: ProviderDraft = {
  name: "",
  nicks: [],
  bio: "",
  clinical: false,
  photoUrl: null,
  iconFile: null,
};

const DEFAULT_PROGRAMME: ProgrammeDraft = {
  name: "",
  nicks: [],
  bio: "",
  durationFromYear: defaultProgrammeYears.durationFromYear,
  durationToYear: defaultProgrammeYears.durationToYear,
  coverUrl: null,
  coverFile: null,
};

const DEFAULT_TAG: TagDraft = {
  mainTitle: "",
  tags: [],
};

function navigateToStep1(
  router: ReturnType<typeof useRouter>,
  type: CreativeStudiosType,
) {
  router.replace(DYNAMIC_ROUTES.curator.createFlow(type, 1) as Route);
}

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
  const { createCampus, createProgramme, createTag, createSpecialty } =
    useCreativeStudiosQuery();

  const preview = useMemo((): PreviewPanelProps => {
    switch (type) {
      case "campus":
        return {
          name: drafts.campus.name || "Campus Name",
          nick: drafts.campus.nicks[0] || "",
          type: drafts.campus.type,
          loc: drafts.campus.location,
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
        return { name: drafts.tag.mainTitle || "Tag Title" };
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
      programme: {
        ...DEFAULT_PROGRAMME,
        ...getDefaultProgrammeYears(),
      },
      tag: { ...DEFAULT_TAG },
    });
  };

  const submitCampus = async () => {
    await createCampus({
      fullName: drafts.campus.name.trim(),
      nicknames: [...drafts.campus.nicks],
      motto: drafts.campus.motto,
      type: drafts.campus.type,
      location: drafts.campus.location,
      logo: drafts.campus.logoFile,
      bannerPhoto: drafts.campus.bannerFile,
    });
    resetDrafts();
    navigateToStep1(router, "campus");
  };

  const submitProvider = async () => {
    await createSpecialty({
      name: drafts.provider.name.trim(),
      nicknames: [...drafts.provider.nicks],
      bio: drafts.provider.bio,
      clinical: drafts.provider.clinical,
      icon: drafts.provider.iconFile,
    });
    resetDrafts();
    navigateToStep1(router, "provider");
  };

  const submitProgramme = async () => {
    await createProgramme({
      fullName: drafts.programme.name.trim(),
      nicknames: [...drafts.programme.nicks],
      bio: drafts.programme.bio,
      durationFromYear: drafts.programme.durationFromYear,
      durationToYear: drafts.programme.durationToYear,
      coverPhoto: drafts.programme.coverFile,
    });
    resetDrafts();
    navigateToStep1(router, "programme");
  };

  const submitTag = async () => {
    await createTag({
      mainTitle: drafts.tag.mainTitle.trim(),
      tags: [...drafts.tag.tags],
    });
    resetDrafts();
    navigateToStep1(router, "tag");
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
