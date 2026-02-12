import { atom } from "jotai";

export interface Partner {
  id: string | number;
  name: string;
  nickname?: string;
  slogan?: string;
  logo?: string;
}

interface CuratorPartnersState {
  partners: Partner[];
  lastUpdated: number | null;
  isLoading: boolean;
}

const initialState: CuratorPartnersState = {
  partners: [],
  lastUpdated: null,
  isLoading: false,
};

export const curatorPartnersAtom = atom<CuratorPartnersState>(initialState);
