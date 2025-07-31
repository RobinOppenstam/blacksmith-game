'use client';

import { WeaponType, Rarity, type Weapon } from '@/types/game';
import { getRarityColor, getRarityName, getWeaponTypeName } from '@/lib/weapons';
import { Sword, Target, Zap, ExternalLink, Calendar, User } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface WeaponCardProps {
  weapon: Weapon;
}

export function WeaponCard({ weapon }: WeaponCardProps) {
  const weaponIcons = {
    [WeaponType.SWORD]: Sword,
    [WeaponType.BOW]: Target,
    [WeaponType.AXE]: Zap,
  };

  const IconComponent = weaponIcons[weapon.weaponType];
  const rarityColor = getRarityColor(weapon.rarity);
  const rarityName = getRarityName(weapon.rarity);
  const weaponTypeName = getWeaponTypeName(weapon.weaponType);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const maxStat = Math.max(weapon.damage, weapon.durability, weapon.speed);
  const totalStats = weapon.damage + weapon.durability + weapon.speed;

  const statBars = [
    { label: 'DMG', value: weapon.damage, color: 'bg-red-500', icon: '⚔️' },
    { label: 'DUR', value: weapon.durability, color: 'bg-blue-500', icon: '🛡️' },
    { label: 'SPD', value: weapon.speed, color: 'bg-green-500', icon: '⚡' },
  ];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={clsx(
        'bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 border-2 transition-all duration-300 relative overflow-hidden',
        rarityColor,
        'hover:shadow-lg'
      )}
    >
      {/* Rarity Glow Effect */}
      <div className={clsx(
        'absolute inset-0 opacity-5 rounded-lg',
        weapon.rarity === Rarity.LEGENDARY ? 'bg-yellow-400' :
        weapon.rarity === Rarity.EPIC ? 'bg-purple-400' :
        weapon.rarity === Rarity.RARE ? 'bg-blue-400' :
        weapon.rarity === Rarity.UNCOMMON ? 'bg-green-400' :
        'bg-gray-400'
      )} />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center flex-1">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <IconComponent className="h-7 w-7 mr-3 text-gray-300" />
          </motion.div>
          <div className="flex-1">
            <h4 className="font-semibold text-white text-base">
              {weaponTypeName} #{weapon.tokenId}
            </h4>
            <p className="text-sm text-gray-400">Tier {weapon.tier}</p>
          </div>
        </div>
        
        <div className="text-right">
          <span className={clsx(
            'text-xs font-bold px-2 py-1 rounded-full border',
            rarityColor
          )}>
            {rarityName}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3 mb-4 relative z-10">
        {statBars.map((stat, index) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center"
          >
            <div className="flex items-center w-16">
              <span className="text-xs mr-1">{stat.icon}</span>
              <span className="text-xs font-medium text-gray-400">{stat.label}</span>
            </div>
            <div className="flex-1 mx-3">
              <div className="stat-bar">
                <motion.div 
                  className={clsx('h-full rounded-full', stat.color)}
                  initial={{ width: 0 }}
                  animate={{ width: `${(stat.value / maxStat) * 100}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="w-8 text-right">
              <span className="text-sm font-bold text-white">{stat.value}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total Stats */}
      <div className="flex items-center justify-between mb-4 p-2 bg-gray-700/30 rounded-lg relative z-10">
        <span className="text-xs text-gray-400">Total Stats</span>
        <span className="text-sm font-bold gradient-text">{totalStats}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 relative z-10">
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Forged {formatDate(weapon.craftedAt)}</span>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center hover:text-amber-400 transition-colors"
          onClick={() => {
            // TODO: Open NFT details or external marketplace
            console.log('View NFT:', weapon.tokenId);
          }}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          View NFT
        </motion.button>
      </div>

      {/* Legendary Sparkle Effect */}
      {weapon.rarity === Rarity.LEGENDARY && (
        <div className="absolute top-2 right-2">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-yellow-400"
          >
            ✨
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}