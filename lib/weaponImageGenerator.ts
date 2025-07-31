// src/lib/weaponImageGenerator.ts
import { WeaponType, Rarity } from '@/types/game';

export interface WeaponImageConfig {
  width: number;
  height: number;
  weaponType: WeaponType;
  tier: number;
  rarity: Rarity;
  damage: number;
  durability: number;
  speed: number;
}

/**
 * Generate a weapon image using Canvas API
 */
export function generateWeaponImage(config: WeaponImageConfig): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      canvas.width = config.width;
      canvas.height = config.height;

      // Background
      drawBackground(ctx, canvas.width, canvas.height, config.rarity);
      
      // Weapon shape
      drawWeapon(ctx, canvas.width, canvas.height, config);
      
      // Rarity effects
      drawRarityEffects(ctx, canvas.width, canvas.height, config.rarity);
      
      // Stats overlay
      drawStatsOverlay(ctx, canvas.width, canvas.height, config);
      
      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to generate image blob'));
        }
      }, 'image/png');
      
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Draw background based on rarity
 */
function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number, rarity: Rarity) {
  const rarityColors = {
    [Rarity.COMMON]: ['#2a2a2a', '#1a1a1a'],
    [Rarity.UNCOMMON]: ['#1a4a1a', '#0a2a0a'],
    [Rarity.RARE]: ['#1a2a4a', '#0a1a2a'],
    [Rarity.EPIC]: ['#4a1a4a', '#2a0a2a'],
    [Rarity.LEGENDARY]: ['#4a3a1a', '#2a1a0a']
  };

  const [color1, color2] = rarityColors[rarity];
  
  // Radial gradient background
  const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add subtle texture
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.05})`;
    ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
  }
}

/**
 * Draw weapon based on type and tier
 */
function drawWeapon(ctx: CanvasRenderingContext2D, width: number, height: number, config: WeaponImageConfig) {
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = Math.min(width, height) / 400;
  
  // Weapon colors based on tier
  const tierColors = [
    '#8B7355', // Tier 1-2: Bronze
    '#C0C0C0', // Tier 3-4: Silver  
    '#FFD700', // Tier 5-6: Gold
    '#E6E6FA', // Tier 7-8: Platinum
    '#FF6B6B'  // Tier 9-10: Legendary
  ];
  
  const colorIndex = Math.min(Math.floor((config.tier - 1) / 2), tierColors.length - 1);
  const weaponColor = tierColors[colorIndex];
  
  ctx.fillStyle = weaponColor;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2 * scale;
  
  switch (config.weaponType) {
    case WeaponType.SWORD:
      drawSword(ctx, centerX, centerY, scale, config.tier);
      break;
    case WeaponType.BOW:
      drawBow(ctx, centerX, centerY, scale, config.tier);
      break;
    case WeaponType.AXE:
      drawAxe(ctx, centerX, centerY, scale, config.tier);
      break;
  }
}

/**
 * Draw sword shape
 */
function drawSword(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, tier: number) {
  const length = 120 * scale * (1 + tier * 0.1);
  const width = 20 * scale;
  
  ctx.save();
  ctx.translate(x, y);
  
  // Blade
  ctx.beginPath();
  ctx.moveTo(0, -length/2);
  ctx.lineTo(-width/2, length/4);
  ctx.lineTo(-width/4, length/2);
  ctx.lineTo(width/4, length/2);
  ctx.lineTo(width/2, length/4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Handle
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(-width/3, length/2, width/1.5, length/6);
  ctx.strokeRect(-width/3, length/2, width/1.5, length/6);
  
  // Guard
  ctx.fillStyle = '#4A4A4A';
  ctx.fillRect(-width, length/4, width*2, width/3);
  ctx.strokeRect(-width, length/4, width*2, width/3);
  
  ctx.restore();
}

/**
 * Draw bow shape
 */
function drawBow(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, tier: number) {
  const size = 100 * scale * (1 + tier * 0.08);
  
  ctx.save();
  ctx.translate(x, y);
  
  // Bow arc
  ctx.beginPath();
  ctx.arc(0, 0, size, Math.PI * 0.2, Math.PI * 0.8, false);
  ctx.lineWidth = 8 * scale;
  ctx.stroke();
  
  // String
  ctx.beginPath();
  ctx.moveTo(-size * 0.7, -size * 0.7);
  ctx.lineTo(-size * 0.7, size * 0.7);
  ctx.lineWidth = 2 * scale;
  ctx.strokeStyle = '#DDDDDD';
  ctx.stroke();
  
  // Arrow nock point
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.arc(-size * 0.7, 0, 4 * scale, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

/**
 * Draw axe shape
 */
function drawAxe(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, tier: number) {
  const handleLength = 100 * scale * (1 + tier * 0.1);
  const bladeWidth = 60 * scale;
  
  ctx.save();
  ctx.translate(x, y);
  
  // Handle
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(-5 * scale, -handleLength/2, 10 * scale, handleLength);
  ctx.strokeRect(-5 * scale, -handleLength/2, 10 * scale, handleLength);
  
  // Blade
  ctx.fillStyle = ctx.fillStyle; // Use weapon color
  ctx.beginPath();
  ctx.moveTo(5 * scale, -handleLength/4);
  ctx.lineTo(bladeWidth, -handleLength/6);
  ctx.lineTo(bladeWidth, handleLength/6);
  ctx.lineTo(5 * scale, handleLength/4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
}

/**
 * Draw rarity effects
 */
function drawRarityEffects(ctx: CanvasRenderingContext2D, width: number, height: number, rarity: Rarity) {
  if (rarity === Rarity.LEGENDARY) {
    // Golden sparkles for legendary
    ctx.fillStyle = '#FFD700';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 3 + 1;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.random() * Math.PI);
      
      // Draw sparkle
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.3, -size * 0.3);
      ctx.lineTo(size, 0);
      ctx.lineTo(size * 0.3, size * 0.3);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.3, size * 0.3);
      ctx.lineTo(-size, 0);
      ctx.lineTo(-size * 0.3, -size * 0.3);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }
  } else if (rarity >= Rarity.EPIC) {
    // Purple glow for epic+
    ctx.shadowColor = rarity === Rarity.EPIC ? '#8A2BE2' : '#FFD700';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
}

/**
 * Draw stats overlay
 */
function drawStatsOverlay(ctx: CanvasRenderingContext2D, width: number, height: number, config: WeaponImageConfig) {
  const padding = 20;
  const fontSize = 14;
  
  ctx.font = `${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  
  // Tier indicator
  const tierText = `Tier ${config.tier}`;
  ctx.strokeText(tierText, padding, padding + fontSize);
  ctx.fillText(tierText, padding, padding + fontSize);
  
  // Rarity indicator
  const rarityNames = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  const rarityText = rarityNames[config.rarity];
  const rarityColors = ['#808080', '#1eff00', '#0070dd', '#a335ee', '#ff8000'];
  
  ctx.fillStyle = rarityColors[config.rarity];
  ctx.strokeText(rarityText, padding, height - padding - fontSize * 2);
  ctx.fillText(rarityText, padding, height - padding - fontSize * 2);
  
  // Stats
  ctx.fillStyle = '#FFFFFF';
  const stats = [
    `DMG: ${config.damage}`,
    `DUR: ${config.durability}`, 
    `SPD: ${config.speed}`
  ];
  
  stats.forEach((stat, index) => {
    const y = height - padding - fontSize * (2 - index) + fontSize * 0.5;
    ctx.strokeText(stat, width - padding - ctx.measureText(stat).width, y);
    ctx.fillText(stat, width - padding - ctx.measureText(stat).width, y);
  });
}

/**
 * Create weapon image component for upload
 */
export async function createWeaponImageFile(config: WeaponImageConfig): Promise<File> {
  const blob = await generateWeaponImage(config);
  const filename = `weapon-${config.weaponType}-tier${config.tier}-${config.rarity}-${Date.now()}.png`;
  return new File([blob], filename, { type: 'image/png' });
}

/**
 * Generate placeholder weapon images for all combinations
 */
export async function generateAllWeaponImages(): Promise<Map<string, Blob>> {
  const images = new Map<string, Blob>();
  
  for (let weaponType = 0; weaponType <= 2; weaponType++) {
    for (let tier = 1; tier <= 10; tier++) {
      for (let rarity = 0; rarity <= 4; rarity++) {
        const config: WeaponImageConfig = {
          width: 400,
          height: 400,
          weaponType: weaponType as WeaponType,
          tier,
          rarity: rarity as Rarity,
          damage: 30 + tier * 10 + rarity * 5,
          durability: 50 + tier * 8 + rarity * 4,
          speed: 35 + tier * 5 + rarity * 3
        };
        
        try {
          const blob = await generateWeaponImage(config);
          const key = `${weaponType}-${tier}-${rarity}`;
          images.set(key, blob);
        } catch (error) {
          console.error(`Failed to generate image for ${weaponType}-${tier}-${rarity}:`, error);
        }
      }
    }
  }
  
  return images;
}