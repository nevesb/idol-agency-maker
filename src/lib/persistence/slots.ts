import type { SubscriptionTier } from './types';

/** P5-04: free = 1 slot (0); premium = 5 slots (0–4). */
export function maxSlotCount(tier: SubscriptionTier): number {
	return tier === 'premium' ? 5 : 1;
}

export function canUseSlot(tier: SubscriptionTier, slotIndex: number): boolean {
	return slotIndex >= 0 && slotIndex < maxSlotCount(tier);
}
