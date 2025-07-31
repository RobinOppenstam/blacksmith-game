'use client';

import { type Weapon, WeaponType, Rarity } from '@/types/game';
import { Sword, Target, Zap, TrendingUp, Star, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface CollectionStatsProps {
  weapons: Weapon[];
}

export function CollectionStats({ weapons }: CollectionStatsProps) {
  // Calculate stats
  const totalWeapons = weapons.length;
  const swordCount = weapons.filter(w => w.weaponType === WeaponType.SWORD).length;
  const bowCount = weapons.filter(w => w.weaponType === WeaponType.BOW).length;
  const axeCount = weapons.filter(w => w.weaponType === WeaponType.AXE).length;

  const rarityDistribution = {
    [Rarity.COMMON]: weapons.filter(w => w.rarity === Rarity.COMMON).length,
    [Rarity.UNCOMMON]: weapons.filter(w => w.rarity === Rarity.UNCOMMON).length,
    [Rarity.RARE]: weapons.filter(w => w.rarity === Rarity.RARE).length,
    [Rarity.EPIC]: weapons.filter(w => w.rarity === Rarity.EPIC).length,
    [Rarity.LEGENDARY]: weapons.filter(w => w.rarity === Rarity.LEGENDARY).length,
  };

  const averageStats = weapons.length > 0 ? {
    damage: Math.round(weapons.reduce((sum, w) => sum + w.damage, 0) / weapons.length),
    durability: Math.round(weapons.reduce((sum, w) => sum + w.durability, 0) / weapons.length),
    speed: Math.round(weapons.reduce((sum, w) => sum + w.speed, 0) / weapons.length),
  } : { damage: 0, durability: 0, speed: 0 };

  const highestTier = weapons.length > 0 ? Math.max(...weapons.map(w => w.tier)) : 0;
  const totalValue = weapons.reduce((sum, w) => sum + w.damage + w.durability + w.speed, 0);

  const stats = [
    {
      label: 'Total Weapons',
      value: totalWeapons,
      icon: Trophy,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    },
    {
      label: 'Highest Tier',
      value: highestTier,
      icon: Star,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      label: 'Total Value',
      value: totalValue,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      label: 'Legendary Count',
      value: rarityDistribution[Rarity.LEGENDARY],
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
  ];

  if (totalWeapons === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={stat.label} className="weapon-card text-center">
            <stat.icon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-600">0</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${stat.bgColor} ${stat.borderColor}`}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value.toLocaleString()}
              </div>
            </div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weapon Type Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="weapon-card"
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Sword className="h-5 w-5 mr-2 text-amber-500" />
            Weapon Distribution
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sword className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">Swords</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">{swordCount}</span>
                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${totalWeapons > 0 ? (swordCount / totalWeapons) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">Bows</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">{bowCount}</span>
                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${totalWeapons > 0 ? (bowCount / totalWeapons) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-orange-400" />
                <span className="text-gray-300">Axes</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">{axeCount}</span>
                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${totalWeapons > 0 ? (axeCount / totalWeapons) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Average Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="weapon-card"
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-amber-500" />
            Average Stats
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {averageStats.damage}
              </div>
              <div className="text-xs text-gray-400">Avg Damage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {averageStats.durability}
              </div>
              <div className="text-xs text-gray-400">Avg Durability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {averageStats.speed}
              </div>
              <div className="text-xs text-gray-400">Avg Speed</div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-center">
              <div className="text-xl font-bold gradient-text mb-1">
                {averageStats.damage + averageStats.durability + averageStats.speed}
              </div>
              <div className="text-xs text-gray-400">Total Average</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}