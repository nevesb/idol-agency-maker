import { describe, expect, it } from 'vitest';
import { getIdolPortraitPublicUrl, IDOL_PORTRAITS_BUCKET } from './idol-image';

describe('getIdolPortraitPublicUrl', () => {
	it('monta path público do Storage', () => {
		const u = getIdolPortraitPublicUrl('https://abc.supabase.co', 'idol_01', 'base');
		expect(u).toContain('https://abc.supabase.co/storage/v1/object/public/');
		expect(u).toContain(IDOL_PORTRAITS_BUCKET);
		expect(u).toContain('idol_01');
		expect(u).toContain('base.webp');
	});
});
