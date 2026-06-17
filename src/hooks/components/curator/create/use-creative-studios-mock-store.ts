"use client";

import { useCallback, useSyncExternalStore } from "react";
import { MOCK_SEED_COUNTS } from "@/lib/constants/components/curator/create/creative-studios";
import type {
  CampusRecord,
  CreativeStudiosMockRecords,
  ProgrammeRecord,
  ProviderRecord,
  TagRecord,
} from "@/lib/types/components/curator/create/creative-studios";

function buildSeedRecords(): CreativeStudiosMockRecords {
  return {
    campuses: Array.from({ length: MOCK_SEED_COUNTS.campuses }, (_, i) => ({
      name: `Campus ${i + 1}`,
      nicks: [],
    })),
    providers: Array.from({ length: MOCK_SEED_COUNTS.providers }, (_, i) => ({
      name: `Provider ${i + 1}`,
      nicks: [],
    })),
    programmes: Array.from({ length: MOCK_SEED_COUNTS.programmes }, (_, i) => ({
      name: `Programme ${i + 1}`,
      nicks: [],
      df: 1,
      dt: 1,
    })),
    tags: Array.from({ length: MOCK_SEED_COUNTS.tags }, (_, i) => ({
      title: `Tag Group ${i + 1}`,
    })),
  };
}

let records: CreativeStudiosMockRecords = buildSeedRecords();
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return records;
}

export function useCreativeStudiosMockStore() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const addCampus = useCallback((campus: CampusRecord) => {
    records = {
      ...records,
      campuses: [...records.campuses, campus],
    };
    emitChange();
  }, []);

  const addProvider = useCallback((provider: ProviderRecord) => {
    records = {
      ...records,
      providers: [...records.providers, provider],
    };
    emitChange();
  }, []);

  const addProgramme = useCallback((programme: ProgrammeRecord) => {
    records = {
      ...records,
      programmes: [...records.programmes, programme],
    };
    emitChange();
  }, []);

  const addTag = useCallback((tag: TagRecord) => {
    records = {
      ...records,
      tags: [...records.tags, tag],
    };
    emitChange();
  }, []);

  return {
    records: data,
    addCampus,
    addProvider,
    addProgramme,
    addTag,
  };
}
