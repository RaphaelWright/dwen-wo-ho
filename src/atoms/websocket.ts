import { atom } from "jotai";
import { ConnectionStatus } from "@/lib/types/entities/websocket";

export const connectionStatusAtom = atom<ConnectionStatus>("DISCONNECTED");

export const unreadCountAtom = atom<number>(0);

export const urgentCasesAtom = atom<
  Array<{
    patientId: number;
    patientName: string;
    score: number;
    status: string;
    schoolId: number;
    schoolName: string;
    time: string;
  }>
>([]);
