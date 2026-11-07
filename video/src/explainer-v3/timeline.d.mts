export type LineT = {at: number; len: number; startFrom: number; endAt: number};
export type SectionT = {id: string; from: number; len: number; t: Record<string, number>; e: Record<string, number>};
export type Timeline = {lines: Record<string, LineT>; sections: SectionT[]; total: number};
export const FPS: number;
export const SECTIONS: {id: string; lines: string[]}[];
export function buildTimeline(trims: Record<string, {start: number; end: number}>): Timeline;
export function gaps(tl: Timeline): {from: string; to: string; gap: number}[];
