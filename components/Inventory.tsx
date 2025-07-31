'use client';

import { useGame } from '@/contexts/GameContext';
import { useAccount } from 'wagmi';
import { WeaponCard } from './WeaponCard';
import { Package, Sword, Plus, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Weapon } from '@/types/game';

export function Inventory() {
  const { state } = useGame();
  const { address } = useAccount();
  const [isLoading] = useState(false);

  // Mock weapons for demonstration - in real app, fetch from contract
  const mockWeapons: Weapon[] = [
    {
      tokenId: '1',
      weaponType: 0, // SWORD
      tier: 1,
      rarity: 0, // COMMON
      damage: 32,
      durability: 55,
      speed: 38,
      craftedAt: Date.now() - 86400000,
      craftedBy: address!,
      ipfsHash: 'QmMock1',
    },
    {
      tokenId: '2',
      weaponType: 1, // BOW
      tier: 2,
      rarity: 2, // RARE
      damage: 42,
      durability: 48,
      speed: 65,
      craftedAt: Date.now() - 172800000,
      craftedBy: address!,
      ipfsHash: 'QmMock2',
    },
  ];

  const weapons = state.player?.isRegistered ? mockWeapons : [];
  const totalWeapons = state.player ? 
    state.player.swordsCrafted + state.player.bowsCrafted + state.player.axesCrafted : 0;

  if (!state.player?.isRegistered) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="weapon-card"
      >
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg text-gray-400 mb-2">Arsenal Locked</h3>
          <p className="text-gray-500">Register to view your weapon collection</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="weapon-card"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Package className="h-6 w-6 text-amber-500 mr-3" />
          <h3 className="text-xl font-semibold gradient-text">Weapon Arsenal</h3>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            {totalWeapons} forged
          </span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="text-lg font-bold text-blue-400">{state.player.swordsCrafted}</div>
          <div className="text-xs text-gray-400">Swords</div>
        </div>
        <div className="text-center p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="text-lg font-bold text-green-400">{state.player.bowsCrafted}</div>
          <div className="text-xs text-gray-400">Bows</div>
        </div>
        <div className="text-center p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <div className="text-lg font-bold text-orange-400">{state.player.axesCrafted}</div>
          <div className="text-xs text-gray-400">Axes</div>
        </div>
      </div>

      {/* Weapons List */}
      <AnimatePresence>
        {isLoading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="animate-spin h-10 w-10 border-3 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your arsenal...</p>
          </motion.div>
        ) : weapons.length > 0 ? (
          <motion.div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
            {weapons.map((weapon, index) => (
              <motion.div
                key={weapon.tokenId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <WeaponCard weapon={weapon} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sword className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-lg text-gray-400 mb-2">Empty Arsenal</h3>
            <p className="text-sm text-gray-500 mb-4">
              No weapons forged yet. Start crafting to build your collection!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center text-amber-400 text-sm cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-1" />
              Forge your first weapon
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}