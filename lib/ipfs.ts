// src/lib/ipfs.ts
import { WeaponType, Rarity, type Weapon } from '@/types/game';
import { WEAPON_DEFINITIONS, getWeaponTypeName, getRarityName } from './weapons';

export interface WeaponMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
  }>;
  background_color?: string;
  animation_url?: string;
}

/**
 * Generate comprehensive NFT metadata for a weapon
 */
export function generateWeaponMetadata(
  weaponType: WeaponType,
  tier: number,
  rarity: Rarity,
  damage: number,
  durability: number,
  speed: number,
  tokenId: string,
  craftedBy: string,
  imageIpfsHash?: string
): WeaponMetadata {
  const weaponDef = WEAPON_DEFINITIONS[weaponType][tier - 1];
  const weaponTypeName = getWeaponTypeName(weaponType);
  const rarityName = getRarityName(rarity);
  
  // Calculate derived stats
  const totalStats = damage + durability + speed;
  const averageStat = Math.round(totalStats / 3);
  const powerLevel = Math.round(totalStats * (tier / 10) * (rarity + 1));

  // Rarity background colors
  const rarityColors = {
    [Rarity.COMMON]: "808080",
    [Rarity.UNCOMMON]: "1eff00", 
    [Rarity.RARE]: "0070dd",
    [Rarity.EPIC]: "a335ee",
    [Rarity.LEGENDARY]: "ff8000"
  };

  // Use provided image hash or generate placeholder URL
  const imageUrl = imageIpfsHash 
    ? `https://gateway.pinata.cloud/ipfs/${imageIpfsHash}`
    : generateImageUrl(weaponType, tier, rarity);

  return {
    name: `${weaponDef.name} #${tokenId}`,
    description: `${weaponDef.description}\n\nThis ${rarityName.toLowerCase()} ${weaponTypeName.toLowerCase()} was masterfully forged by a skilled blacksmith on the Avalanche blockchain. Each weapon is unique with randomized stats and exists as a verifiable NFT.\n\nForged by: ${craftedBy === 'TBD' ? 'Blacksmith' : `${craftedBy.slice(0, 6)}...${craftedBy.slice(-4)}`}`,
    image: imageUrl,
    external_url: `${typeof window !== 'undefined' ? window.location.origin : 'https://blacksmith-forge.com'}/weapon/${tokenId}`,
    background_color: rarityColors[rarity],
    attributes: [
      {
        trait_type: "Weapon Type",
        value: weaponTypeName
      },
      {
        trait_type: "Tier",
        value: tier,
        display_type: "number"
      },
      {
        trait_type: "Rarity",
        value: rarityName // Fixed: use rarityName instead of rarity number
      },
      {
        trait_type: "Damage",
        value: damage,
        display_type: "number"
      },
      {
        trait_type: "Durability", 
        value: durability,
        display_type: "number"
      },
      {
        trait_type: "Speed",
        value: speed,
        display_type: "number"
      },
      {
        trait_type: "Total Stats",
        value: totalStats,
        display_type: "number"
      },
      {
        trait_type: "Average Stat",
        value: averageStat,
        display_type: "number"
      },
      {
        trait_type: "Power Level",
        value: powerLevel,
        display_type: "number"
      },
      {
        trait_type: "Generation",
        value: "Genesis"
      },
      {
        trait_type: "Blockchain",
        value: "Avalanche"
      }
    ]
  };
}

/**
 * Generate image URL for weapon (placeholder for now)
 */
function generateImageUrl(weaponType: WeaponType, tier: number, rarity: Rarity): string {
  const typeNames = ['sword', 'bow', 'axe'];
  const rarityNames = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  
  // For now, return a placeholder. Later we'll generate or use pre-made images
  return `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}weapon-images/${typeNames[weaponType]}-tier${tier}-${rarityNames[rarity]}.png`;
}

/**
 * Upload JSON metadata to IPFS via Pinata
 */
export async function uploadMetadataToIPFS(metadata: WeaponMetadata): Promise<string> {
  try {
    const response = await fetch('/api/upload-metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload metadata to IPFS');
    }

    const { ipfsHash } = await response.json();
    return `ipfs://${ipfsHash}`;
  } catch (error) {
    console.error('IPFS metadata upload failed:', error);
    throw error;
  }
}

/**
 * Upload image to IPFS via Pinata
 */
export async function uploadImageToIPFS(imageFile: File, weaponInfo: {
  weaponType: WeaponType;
  tier: number;
  rarity: Rarity;
  tokenId: string;
}): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('weaponInfo', JSON.stringify(weaponInfo));

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload image to IPFS');
    }

    const { ipfsHash } = await response.json();
    return `ipfs://${ipfsHash}`;
  } catch (error) {
    console.error('IPFS image upload failed:', error);
    throw error;
  }
}

/**
 * Get IPFS content via gateway
 */
export function getIPFSUrl(ipfsHash: string): string {
  if (ipfsHash.startsWith('ipfs://')) {
    return ipfsHash.replace('ipfs://', process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/');
  }
  return `${process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/'}${ipfsHash}`;
}

/**
 * Validate IPFS hash format
 */
export function isValidIPFSHash(hash: string): boolean {
  // Basic validation for IPFS hash (v0 and v1)
  const ipfsHashRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,})$/;
  const cleanHash = hash.replace('ipfs://', '');
  return ipfsHashRegex.test(cleanHash);
}