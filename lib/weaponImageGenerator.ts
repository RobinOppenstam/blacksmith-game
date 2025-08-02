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
      drawBow(ctx, centerX, centerY, scale, config.tier, weaponColor);
      break;
    case WeaponType.AXE:
      drawAxe(ctx, centerX, centerY, scale, config.tier, weaponColor);
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
 * Draw bow shape - FIXED
 */
function drawBow(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, tier: number, weaponColor: string) {
  const size = 100 * scale * (1 + tier * 0.08);
  
  ctx.save();
  ctx.translate(x, y);
  
  // Bow body - draw as curved wood
  ctx.strokeStyle = '#8B4513';
  ctx.fillStyle = '#8B4513';
  ctx.lineWidth = 8 * scale;
  
  // Left limb
  ctx.beginPath();
  ctx.arc(0, 0, size, Math.PI * 0.7, Math.PI * 1.3, false);
  ctx.stroke();
  
  // Right limb  
  ctx.beginPath();
  ctx.arc(0, 0, size, Math.PI * 1.7, Math.PI * 0.3, false);
  ctx.stroke();
  
  // Bow grip (center handle)
  ctx.fillStyle = weaponColor;
  ctx.fillRect(-8 * scale, -20 * scale, 16 * scale, 40 * scale);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2 * scale;
  ctx.strokeRect(-8 * scale, -20 * scale, 16 * scale, 40 * scale);
  
  // Bow string - connect the tips properly
  const topTipX = Math.cos(Math.PI * 0.7) * size;
  const topTipY = Math.sin(Math.PI * 0.7) * size;
  const bottomTipX = Math.cos(Math.PI * 1.3) * size;
  const bottomTipY = Math.sin(Math.PI * 1.3) * size;
  
  ctx.beginPath();
  ctx.moveTo(topTipX, topTipY);
  ctx.lineTo(bottomTipX, bottomTipY);
  ctx.lineWidth = 2 * scale;
  ctx.strokeStyle = '#DDDDDD';
  ctx.stroke();
  
  // Arrow nock point (center of string)
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  const nockX = (topTipX + bottomTipX) / 2;
  const nockY = (topTipY + bottomTipY) / 2;
  ctx.arc(nockX, nockY, 4 * scale, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

/**
 * Draw axe shape - COMPLETELY REDESIGNED
 */
function drawAxe(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, tier: number, weaponColor: string) {
  const handleLength = 120 * scale * (1 + tier * 0.1);
  const handleWidth = 12 * scale;
  const bladeWidth = 80 * scale * (1 + tier * 0.05);
  const bladeHeight = 50 * scale * (1 + tier * 0.05);
  
  ctx.save();
  ctx.translate(x, y);
  
  // Handle (longer and more prominent)
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(-handleWidth/2, -handleLength/2, handleWidth, handleLength);
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = 2 * scale;
  ctx.strokeRect(-handleWidth/2, -handleLength/2, handleWidth, handleLength);
  
  // Handle grip details
  for (let i = 0; i < 3; i++) {
    const gripY = -handleLength/2 + handleLength * 0.6 + i * 15 * scale;
    ctx.strokeStyle = '#4A4A4A';
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.moveTo(-handleWidth/2, gripY);
    ctx.lineTo(handleWidth/2, gripY);
    ctx.stroke();
  }
  
  // Axe head mounting (where blade connects to handle)
  ctx.fillStyle = '#4A4A4A';
  ctx.fillRect(-handleWidth * 0.8, -handleLength/2 + handleLength * 0.3, handleWidth * 1.6, 20 * scale);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2 * scale;
  ctx.strokeRect(-handleWidth * 0.8, -handleLength/2 + handleLength * 0.3, handleWidth * 1.6, 20 * scale);
  
  // Main axe blade (proper axe shape)
  ctx.fillStyle = weaponColor;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2 * scale;
  
  const bladeTop = -handleLength/2 + handleLength * 0.25;
  const bladeBottom = -handleLength/2 + handleLength * 0.45;
  const bladeCenter = (bladeTop + bladeBottom) / 2;
  
  // Create classic axe blade shape
  ctx.beginPath();
  // Start from handle connection point
  ctx.moveTo(handleWidth/2, bladeTop);
  // Curve out to the blade edge
  ctx.quadraticCurveTo(bladeWidth * 0.6, bladeTop - 5 * scale, bladeWidth, bladeCenter);
  // Curve back to bottom connection
  ctx.quadraticCurveTo(bladeWidth * 0.6, bladeBottom + 5 * scale, handleWidth/2, bladeBottom);
  // Connect back along handle
  ctx.lineTo(handleWidth/2, bladeTop);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Back spike (optional, for higher tiers)
  if (tier >= 5) {
    ctx.beginPath();
    ctx.moveTo(-handleWidth/2, bladeCenter);
    ctx.lineTo(-bladeWidth * 0.4, bladeCenter - 10 * scale);
    ctx.lineTo(-bladeWidth * 0.4, bladeCenter + 10 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  
  // Blade edge highlight
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(bladeWidth * 0.8, bladeCenter - bladeHeight * 0.3);
  ctx.quadraticCurveTo(bladeWidth * 0.95, bladeCenter, bladeWidth * 0.8, bladeCenter + bladeHeight * 0.3);
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