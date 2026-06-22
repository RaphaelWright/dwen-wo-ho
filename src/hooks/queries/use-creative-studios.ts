"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { creativeStudiosService } from "@/services/curator/creative-studios";
import { specialtiesService } from "@/services/shared/specialties";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import type {
  CreateCampusInput,
  CreateProgrammeInput,
  CreateSpecialtyInput,
  CreateTagInput,
} from "@/lib/types/api/creative-studios";

export default function useCreativeStudiosQuery() {
  const queryClient = useQueryClient();

  const invalidateCreativeStudiosSummary = () => {
    void queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.curatorSummary],
    });
  };

  const createCampusMutation = useMutation({
    mutationFn: (input: CreateCampusInput) =>
      creativeStudiosService.createCampus(input),
    onSuccess: () => {
      invalidateCreativeStudiosSummary();
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.campuses] });
      toast.success("Campus created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create campus");
    },
  });

  const createProgrammeMutation = useMutation({
    mutationFn: (input: CreateProgrammeInput) =>
      creativeStudiosService.createProgramme(input),
    onSuccess: () => {
      invalidateCreativeStudiosSummary();
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.programmes] });
      toast.success("Programme created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create programme");
    },
  });

  const createTagMutation = useMutation({
    mutationFn: (input: CreateTagInput) =>
      creativeStudiosService.createTag(input),
    onSuccess: () => {
      invalidateCreativeStudiosSummary();
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tags] });
      toast.success("Tag created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create tag");
    },
  });

  const createSpecialtyMutation = useMutation({
    mutationFn: (input: CreateSpecialtyInput) =>
      specialtiesService.createSpecialty(input),
    onSuccess: () => {
      invalidateCreativeStudiosSummary();
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.specialties],
      });
      toast.success("Provider created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create provider");
    },
  });

  return {
    createCampus: createCampusMutation.mutateAsync,
    createProgramme: createProgrammeMutation.mutateAsync,
    createTag: createTagMutation.mutateAsync,
    createSpecialty: createSpecialtyMutation.mutateAsync,
    isCreatingCampus: createCampusMutation.isPending,
    isCreatingProgramme: createProgrammeMutation.isPending,
    isCreatingTag: createTagMutation.isPending,
    isCreatingSpecialty: createSpecialtyMutation.isPending,
  };
}
