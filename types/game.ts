export enum WeaponType {
  SWORD = 0,
  BOW = 1,
  AXE = 2
}

export enum Rarity {
  COMMON = 0,
  UNCOMMON = 1,
  RARE = 2,
  EPIC = 3,
  LEGENDARY = 4
}

export interface Player {
  level: number;
  experience: number;
  swordsCrafted: number;
  bowsCrafted: number;
  axesCrafted: number;
  isRegistered: boolean;
}

export interface Weapon {
  tokenId: string;
  weaponType: WeaponType;
  tier: number;
  rarity: Rarity;
  damage: number;
  durability: number;
  speed: number;
  craftedAt: number;
  craftedBy: string;
  ipfsHash: string;
}

export interface WeaponDefinition {
  name: string;
  description: string;
  requiredLevel: number;
  baseStats: {
    damage: number;
    durability: number;
    speed: number;
  };
}