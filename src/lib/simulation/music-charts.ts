import type { Song } from '$lib/types/simulation';
import { mulberry32, randomBetween } from '$lib/simulation/rng';

/** P6-20: Create a new song entry. */
export function createSong(
	title: string,
	composerId: string,
	quality: number,
	releaseWeek: number
): Song {
	return {
		id: `song_${releaseWeek}_${title.toLowerCase().replace(/\s+/g, '_')}`,
		title,
		composerId,
		producerId: '',
		quality: Math.max(1, Math.min(100, Math.round(quality))),
		releaseWeek,
		chartPosition: 0,
		royalties: 0
	};
}

const MAX_CHART = 100;
const DEBUT_POSITION_BASE = 50;
const QUALITY_POSITION_FACTOR = 0.45;

/**
 * P6-21/P6-22: Simulate weekly chart movement for all songs.
 * New releases debut based on quality; existing songs drift with decay + randomness.
 */
export function updateChartPositions(
	songs: Song[],
	week: number,
	seed: number
): Song[] {
	const rng = mulberry32((seed ^ (week * 0x7f4a7c15)) >>> 0);

	return songs.map((song) => {
		if (song.chartPosition === 0 && song.releaseWeek === week) {
			const debutPos = Math.max(
				1,
				Math.round(DEBUT_POSITION_BASE - song.quality * QUALITY_POSITION_FACTOR + randomBetween(rng, -5, 5))
			);
			return { ...song, chartPosition: Math.min(MAX_CHART, debutPos) };
		}

		if (song.chartPosition === 0 || song.chartPosition > MAX_CHART) return song;

		const weeksSinceRelease = week - song.releaseWeek;
		const decayRate = 1 + weeksSinceRelease * 0.3;
		const qualityBoost = (song.quality - 50) * 0.05;
		const noise = randomBetween(rng, -3, 3);
		const drift = decayRate - qualityBoost + noise;

		const newPos = Math.round(song.chartPosition + drift);
		const clamped = Math.max(1, Math.min(MAX_CHART + 1, newPos));

		return {
			...song,
			chartPosition: clamped > MAX_CHART ? 0 : clamped
		};
	});
}

/** P6-23: Compute royalties based on chart position. Top positions yield more. */
export function computeRoyalties(song: Song): number {
	if (song.chartPosition <= 0 || song.chartPosition > MAX_CHART) return 0;

	const pos = song.chartPosition;
	if (pos <= 3) return 500_000;
	if (pos <= 10) return 200_000;
	if (pos <= 30) return 80_000;
	if (pos <= 50) return 30_000;
	if (pos <= 80) return 10_000;
	return 3_000;
}
