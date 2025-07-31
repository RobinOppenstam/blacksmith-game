// src/types/collection.ts
import { WeaponType, Rarity } from './game';

export interface FilterState {
  weaponType: WeaponType | 'all';
  rarity: Rarity | 'all';
  tier: number | 'all';
  sortBy: 'newest' | 'oldest' | 'rarity' | 'stats';
}