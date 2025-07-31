import { WeaponType, Rarity, type WeaponDefinition } from '@/types/game';

export const WEAPON_DEFINITIONS: Record<WeaponType, WeaponDefinition[]> = {
  [WeaponType.SWORD]: [
    { name: "Iron Sword", description: "A basic but reliable blade", requiredLevel: 1, baseStats: { damage: 30, durability: 50, speed: 35 } },
    { name: "Steel Sword", description: "Stronger and sharper than iron", requiredLevel: 11, baseStats: { damage: 40, durability: 60, speed: 40 } },
    { name: "Silver Sword", description: "Gleaming blade with magical properties", requiredLevel: 21, baseStats: { damage: 50, durability: 70, speed: 45 } },
    { name: "Mithril Sword", description: "Lightweight yet incredibly strong", requiredLevel: 31, baseStats: { damage: 60, durability: 80, speed: 55 } },
    { name: "Enchanted Sword", description: "Imbued with arcane energies", requiredLevel: 41, baseStats: { damage: 70, durability: 90, speed: 50 } },
    { name: "Dragon Sword", description: "Forged from dragon scales and fire", requiredLevel: 51, baseStats: { damage: 80, durability: 100, speed: 60 } },
    { name: "Celestial Blade", description: "Blessed by the stars above", requiredLevel: 61, baseStats: { damage: 90, durability: 110, speed: 65 } },
    { name: "Demon Slayer", description: "Bane of all dark creatures", requiredLevel: 71, baseStats: { damage: 100, durability: 120, speed: 70 } },
    { name: "Phoenix Sword", description: "Reborn from eternal flames", requiredLevel: 81, baseStats: { damage: 110, durability: 130, speed: 75 } },
    { name: "Excalibur", description: "The legendary sword of kings", requiredLevel: 91, baseStats: { damage: 120, durability: 150, speed: 80 } }
  ],
  [WeaponType.BOW]: [
    { name: "Wooden Bow", description: "Simple hunting bow", requiredLevel: 1, baseStats: { damage: 25, durability: 40, speed: 50 } },
    { name: "Composite Bow", description: "Reinforced with horn and sinew", requiredLevel: 11, baseStats: { damage: 35, durability: 50, speed: 55 } },
    { name: "Elvish Bow", description: "Crafted by forest dwellers", requiredLevel: 21, baseStats: { damage: 45, durability: 60, speed: 65 } },
    { name: "Recurve Bow", description: "Advanced design for more power", requiredLevel: 31, baseStats: { damage: 55, durability: 70, speed: 70 } },
    { name: "Longbow", description: "Maximum range and penetration", requiredLevel: 41, baseStats: { damage: 65, durability: 80, speed: 60 } },
    { name: "Shadow Bow", description: "Silent death from the darkness", requiredLevel: 51, baseStats: { damage: 75, durability: 90, speed: 80 } },
    { name: "Storm Bow", description: "Crackling with lightning energy", requiredLevel: 61, baseStats: { damage: 85, durability: 100, speed: 85 } },
    { name: "Ice Bow", description: "Freezes enemies with each shot", requiredLevel: 71, baseStats: { damage: 95, durability: 110, speed: 75 } },
    { name: "Solar Bow", description: "Harnesses the power of the sun", requiredLevel: 81, baseStats: { damage: 105, durability: 120, speed: 90 } },
    { name: "Phoenix Longbow", description: "Arrows that never miss their mark", requiredLevel: 91, baseStats: { damage: 115, durability: 140, speed: 95 } }
  ],
  [WeaponType.AXE]: [
    { name: "Stone Axe", description: "Primitive but effective", requiredLevel: 1, baseStats: { damage: 35, durability: 60, speed: 25 } },
    { name: "Iron Axe", description: "Sharp metal edge", requiredLevel: 11, baseStats: { damage: 45, durability: 70, speed: 30 } },
    { name: "Battle Axe", description: "Designed for war", requiredLevel: 21, baseStats: { damage: 55, durability: 80, speed: 35 } },
    { name: "Dwarven Axe", description: "Masterwork of mountain smiths", requiredLevel: 31, baseStats: { damage: 65, durability: 95, speed: 40 } },
    { name: "Berserker Axe", description: "Fueled by rage and bloodlust", requiredLevel: 41, baseStats: { damage: 75, durability: 85, speed: 50 } },
    { name: "Frost Axe", description: "Chills enemies to the bone", requiredLevel: 51, baseStats: { damage: 85, durability: 100, speed: 45 } },
    { name: "Molten Axe", description: "Blazing hot metal edge", requiredLevel: 61, baseStats: { damage: 95, durability: 110, speed: 55 } },
    { name: "Void Axe", description: "Tears through reality itself", requiredLevel: 71, baseStats: { damage: 105, durability: 120, speed: 60 } },
    { name: "Titan Axe", description: "Wielded by giants of old", requiredLevel: 81, baseStats: { damage: 115, durability: 135, speed: 50 } },
    { name: "Thunderstrike Axe", description: "Each swing calls down lightning", requiredLevel: 91, baseStats: { damage: 125, durability: 150, speed: 65 } }
  ]
};

export const getRarityColor = (rarity: Rarity): string => {
  switch (rarity) {
    case Rarity.COMMON:
      return 'text-gray-400 border-gray-400';
    case Rarity.UNCOMMON:
      return 'text-green-400 border-green-400';
    case Rarity.RARE:
      return 'text-blue-400 border-blue-400';
    case Rarity.EPIC:
      return 'text-purple-400 border-purple-400';
    case Rarity.LEGENDARY:
      return 'text-yellow-400 border-yellow-400';
    default:
      return 'text-gray-400 border-gray-400';
  }
};

export const getRarityName = (rarity: Rarity): string => {
  return Object.keys(Rarity)[rarity] || 'COMMON';
};

export const getWeaponTypeName = (type: WeaponType): string => {
  switch (type) {
    case WeaponType.SWORD:
      return 'Sword';
    case WeaponType.BOW:
      return 'Bow';
    case WeaponType.AXE:
      return 'Axe';
    default:
      return 'Unknown';
  }
};