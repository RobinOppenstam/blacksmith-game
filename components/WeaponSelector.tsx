'use client';

import { useGame } from '@/contexts/GameContext';
import { WeaponType } from '@/types/game';
import { WEAPON_DEFINITIONS } from '@/lib/weapons';
import { Sword, Target, Zap, Lock, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export function WeaponSelector() {
  const { state, dispatch } = useGame();
  
  const weaponIcons = {
    [WeaponType.SWORD]: Sword,
    [WeaponType.BOW]: Target,
    [WeaponType.AXE]: Zap,
  };

  const weaponColors = {
    [WeaponType.SWORD]: 'border-blue-500 text-blue-400 bg-blue-500/10',
    [WeaponType.BOW]: 'border-green-500 text-green-400 bg-green-500/10',
    [WeaponType.AXE]: 'border-orange-500 text-orange-400 bg-orange-500/10',
  };

  const weaponNames = {
    [WeaponType.SWORD]: 'Swords',
    [WeaponType.BOW]: 'Bows',
    [WeaponType.AXE]: 'Axes',
  };

  const handleWeaponTypeSelect = (type: WeaponType) => {
    dispatch({ type: 'SELECT_WEAPON_TYPE', payload: type });
  };

  const handleTierSelect = (tier: number) => {
    dispatch({ type: 'SELECT_TIER', payload: tier });
  };

  const canAccessTier = (tier: number): boolean => {
    const requiredLevel = (tier - 1) * 10 + 1;
    return (state.player?.level || 0) >= requiredLevel;
  };

  // Get weapon types as an array of WeaponType enum values
  const weaponTypes = [WeaponType.SWORD, WeaponType.BOW, WeaponType.AXE];

  return (
    <div className="space-y-6">
      {/* Weapon Type Selection */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Star className="h-5 w-5 mr-2 text-amber-500" />
          Choose Weapon Type
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {weaponTypes.map((type) => {
            const IconComponent = weaponIcons[type];
            const isSelected = state.selectedWeaponType === type;
            
            return (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleWeaponTypeSelect(type)}
                className={clsx(
                  'p-6 rounded-lg border-2 transition-all duration-200 relative overflow-hidden',
                  isSelected 
                    ? weaponColors[type]
                    : 'border-gray-600 text-gray-400 hover:border-gray-500 bg-gray-800/30'
                )}
              >
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <IconComponent className="h-8 w-8 mx-auto mb-3" />
                <div className="text-sm font-medium">
                  {weaponNames[type]}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Weapon Tier Selection */}
      <AnimatePresence>
        {state.selectedWeaponType !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Sword className="h-5 w-5 mr-2 text-amber-500" />
              Select Weapon Tier
            </h3>
            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
              {WEAPON_DEFINITIONS[state.selectedWeaponType as WeaponType].map((weapon, index) => {
                const tier = index + 1;
                const canAccess = canAccessTier(tier);
                const isSelected = state.selectedTier === tier;
                
                return (
                  <motion.button
                    key={tier}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={canAccess ? { scale: 1.02, x: 4 } : {}}
                    onClick={() => canAccess && handleTierSelect(tier)}
                    disabled={!canAccess}
                    className={clsx(
                      'p-4 rounded-lg border text-left transition-all duration-200 relative overflow-hidden',
                      canAccess 
                        ? isSelected
                          ? 'border-amber-500 bg-amber-500/10 text-white shadow-lg shadow-amber-500/20'
                          : 'border-gray-600 text-gray-300 hover:border-amber-500/50 bg-gray-800/50'
                        : 'border-gray-700 text-gray-600 cursor-not-allowed bg-gray-900/50'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-base">{weapon.name}</span>
                      <div className="flex items-center space-x-2">
                        {!canAccess && <Lock className="h-4 w-4" />}
                        <span className={clsx(
                          'text-xs px-2 py-1 rounded-full',
                          tier <= 3 ? 'bg-gray-600 text-gray-300' :
                          tier <= 6 ? 'bg-blue-600 text-blue-200' :
                          tier <= 8 ? 'bg-purple-600 text-purple-200' :
                          'bg-yellow-600 text-yellow-200'
                        )}>
                          Tier {tier}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 mb-3">
                      Requires Level {weapon.requiredLevel}
                      {!canAccess && (
                        <span className="text-red-400 ml-2">
                          (Need {weapon.requiredLevel - (state.player?.level || 0)} more levels)
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                      {weapon.description}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-red-400">
                        ⚔️ {weapon.baseStats.damage} DMG
                      </div>
                      <div className="text-blue-400">
                        🛡️ {weapon.baseStats.durability} DUR
                      </div>
                      <div className="text-green-400">
                        ⚡ {weapon.baseStats.speed} SPD
                      </div>
                    </div>
                    
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 border-2 border-amber-400 rounded-lg pointer-events-none"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}