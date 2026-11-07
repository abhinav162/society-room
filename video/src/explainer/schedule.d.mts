export const FPS: number;
export const BEATS: {id: string; lines: [string, number][]; min?: number}[];
export function schedule(d: Record<string, number>): {id: string; from: number; len: number; t: Record<string, number>}[];
