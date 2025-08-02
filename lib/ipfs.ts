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
  const rarityColors = ['#808080', '#1eff00', '#0070dd', '#a335ee', '#ff8000'];
  
  // Return a data URL placeholder with weapon-specific icons
  const weaponTypeName = typeNames[weaponType];
  const rarityName = rarityNames[rarity];
  const rarityColor = rarityColors[rarity];
  
  // Get weapon-specific SVG path
  const getWeaponIconPath = (type: WeaponType) => {
    switch (type) {
      case WeaponType.SWORD:
        return `
          <path d="M200 50L195 55v230l5 5 5-5V55l-5-5z" fill="#E5E7EB"/>
          <rect x="170" y="285" width="60" height="8" rx="4" fill="#9CA3AF"/>
          <rect x="195" y="293" width="10" height="20" rx="5" fill="#6B7280"/>
          <circle cx="200" cy="320" r="6" fill="#4B5563"/>
        `;
      case WeaponType.BOW:
        return `
          <path d="M120 50c-25 0-42 17-42 42v216c0 25 17 42 42 42 13 0 25-7 33-17L120 200L147 75c-8-17-17-25-27-25z" fill="#E5E7EB"/>
          <path d="M280 50c25 0 42 17 42 42v216c0 25-17 42-42 42-13 0-25-7-33-17L280 200L253 75c8-17 17-25 27-25z" fill="#E5E7EB"/>
          <path d="M147 75Q200 133 253 75 M147 325Q200 267 253 325" stroke="#9CA3AF" stroke-width="4" fill="none"/>
          <line x1="160" y1="200" x2="240" y2="200" stroke="#6B7280" stroke-width="6"/>
          <path d="M240 200l-20-8v16l20-8z" fill="#6B7280"/>
        `;
      case WeaponType.AXE:
        return `
          <rect x="195" y="133" width="10" height="233" rx="5" fill="#8B4513"/>
          <path d="M150 67c-33 0-58 17-58 50v67c0 33 25 50 58 50h100c33 0 58-17 58-50v-67c0-33-25-50-58-50H150z" fill="#E5E7EB"/>
          <path d="M130 100c-17 0-25 8-25 25v50c0 17 8 25 25 25h140c17 0 25-8 25-25v-50c0-17-8-25-25-25H130z" fill="#9CA3AF"/>
          <ellipse cx="200" cy="133" rx="50" ry="17" fill="#6B7280"/>
        `;
      default:
        return `<path d="M200 50L195 55v230l5 5 5-5V55l-5-5z" fill="#E5E7EB"/>`;
    }
  };
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg" cx="50%" cy="30%" r="70%">
          <stop offset="0%" style="stop-color:#4B5563;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#374151;stop-opacity:1" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#bg)"/>
      <g transform="scale(1)">
        ${getWeaponIconPath(weaponType)}
      </g>
      <text x="200" y="340" text-anchor="middle" fill="${rarityColor}" font-size="18" font-family="Arial" font-weight="bold">
        ${weaponTypeName.toUpperCase()}
      </text>
      <text x="200" y="365" text-anchor="middle" fill="#9CA3AF" font-size="14" font-family="Arial">
        Tier ${tier} • ${rarityName}
      </text>
    </svg>
  `)}`;
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

// IPFS gateway endpoints with priority order
const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/',
  'https://ipfs.fleek.co/ipfs/'
];

// Cache for failed gateways to avoid retrying immediately
const gatewayFailureCache = new Map<string, number>();
const FAILURE_CACHE_DURATION = 60000; // 1 minute

/**
 * Get IPFS content via gateway with fallback support
 */
export function getIPFSUrl(ipfsHash: string, gatewayIndex = 0): string {
  // Handle different input formats
  let cleanHash = ipfsHash;
  
  if (ipfsHash.startsWith('ipfs://')) {
    cleanHash = ipfsHash.replace('ipfs://', '');
  } else if (ipfsHash.startsWith('http')) {
    return ipfsHash; // Already a full URL
  } else if (ipfsHash.includes('mypinata.cloud')) {
    const hashPart = ipfsHash.split('mypinata.cloud')[1];
    cleanHash = hashPart.replace(/^[^a-zA-Z0-9]*/, '');
  }
  
  // Get available gateway (skip recently failed ones)
  let availableGatewayIndex = gatewayIndex;
  while (availableGatewayIndex < IPFS_GATEWAYS.length) {
    const gateway = IPFS_GATEWAYS[availableGatewayIndex];
    const lastFailure = gatewayFailureCache.get(gateway);
    
    if (!lastFailure || Date.now() - lastFailure > FAILURE_CACHE_DURATION) {
      return `${gateway}${cleanHash}`;
    }
    
    availableGatewayIndex++;
  }
  
  // If all gateways failed recently, use the first one anyway
  return `${IPFS_GATEWAYS[0]}${cleanHash}`;
}

/**
 * Fetch from IPFS with automatic gateway fallback
 */
export async function fetchFromIPFS(ipfsHash: string, options: RequestInit = {}): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < IPFS_GATEWAYS.length; i++) {
    const url = getIPFSUrl(ipfsHash, i);
    const gateway = IPFS_GATEWAYS[i];
    
    try {
      console.log(`Attempting to fetch from gateway ${i + 1}/${IPFS_GATEWAYS.length}: ${url}`);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        // Clear any previous failure cache for this gateway
        gatewayFailureCache.delete(gateway);
        return response;
      }
      
      // Cache gateway failure for rate limiting (429) or server errors (5xx)
      if (response.status === 429 || response.status >= 500) {
        gatewayFailureCache.set(gateway, Date.now());
        console.warn(`Gateway ${gateway} failed with status ${response.status}, caching failure`);
      }
      
      lastError = new Error(`Gateway ${gateway} returned ${response.status}: ${response.statusText}`);
      
    } catch (error) {
      console.warn(`Gateway ${gateway} failed:`, error);
      gatewayFailureCache.set(gateway, Date.now());
      lastError = error instanceof Error ? error : new Error(`Gateway ${gateway} failed`);
    }
  }
  
  throw lastError || new Error('All IPFS gateways failed');
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