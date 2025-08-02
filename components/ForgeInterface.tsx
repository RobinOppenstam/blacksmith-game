'use client';

import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useBlacksmith } from '@/hooks/useBlacksmith';
import { WEAPON_DEFINITIONS } from '@/lib/weapons';
import { WeaponType } from '@/types/game';
import { Hammer, Flame, Sparkles, Trophy, Coins, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ForgeInterface() {
  const { state } = useGame();
  const { forgeWeapon, isPending, isConfirming, isSuccess, mintingFee, gasEstimate, isProcessing, statusMessage } = useBlacksmith();
  const [forgingStep, setForgingStep] = useState(0);


  const selectedWeapon = state.selectedWeaponType !== null && state.selectedTier !== null
    ? WEAPON_DEFINITIONS[state.selectedWeaponType as WeaponType][state.selectedTier - 1]
    : null;

  const handleForge = async () => {
    if (!selectedWeapon || state.selectedWeaponType === null || state.selectedTier === null) return;
    
    try {
      setForgingStep(1); // "Generating artwork..."
      
      await forgeWeapon(state.selectedWeaponType as WeaponType, state.selectedTier);
      
      setForgingStep(4); // "Weapon forged successfully!"
    } catch (error: any) {
      console.error('Forging failed:', error);
      alert(`Forge failed: ${error?.shortMessage || error?.message || 'Unknown error'}`);
      setForgingStep(0);
    }
  };

  const forgingSteps = [
    'Ready to forge',
    'Generating artwork...',
    'Uploading to IPFS...',
    'Minting NFT...',
    'Weapon forged successfully!'
  ];

  const isForging = isPending || isConfirming || isProcessing;

  return (
    <div className="space-y-6">
      {/* Forge Preview */}
      <div className="glass-card p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Hammer className="h-5 w-5 mr-2 text-amber-500" />
          Forge Preview
        </h3>
        
        <AnimatePresence mode="wait">
          {selectedWeapon ? (
            <motion.div
              key="weapon-selected"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Weapon Info */}
              <div className="text-center p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-600">
                <h4 className="text-xl font-bold gradient-text mb-2">
                  {selectedWeapon.name}
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  {selectedWeapon.description}
                </p>
                
                {/* Base Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400 mb-1">
                      {selectedWeapon.baseStats.damage}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center justify-center">
                      ⚔️ Damage
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {selectedWeapon.baseStats.durability}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center justify-center">
                      🛡️ Durability
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {selectedWeapon.baseStats.speed}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center justify-center">
                      ⚡ Speed
                    </div>
                  </div>
                </div>

                {/* Stats Note */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                  <div className="text-xs text-amber-400 mb-1 flex items-center justify-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Random Variation
                  </div>
                  <div className="text-xs text-gray-300">
                    Final stats will vary ±20% with random rarity bonus
                  </div>
                </div>
              </div>
              
              {/* Forge Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-400 flex items-center">
                    <Coins className="h-4 w-4 mr-2 text-green-400" />
                    Minting Fee
                  </span>
                  <span className="text-white font-medium">
                    {mintingFee ? `${(Number(mintingFee) / 1e18).toFixed(6)} AVAX` : '0.000001 AVAX'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-400 flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-blue-400" />
                    Experience Gained
                  </span>
                  <span className="text-green-400 font-medium">+1000 XP</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-400 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                    Gas Estimate
                  </span>
                  <span className="text-white font-medium">
                    {gasEstimate ? Number(gasEstimate).toLocaleString() : 'Calculating...'}
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="no-weapon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              </motion.div>
              <h4 className="text-lg text-gray-400 mb-2">Ready to Create</h4>
              <p className="text-gray-500">Select a weapon type and tier to begin forging</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Forging Progress */}
      <AnimatePresence>
        {isForging && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="glass-card p-6 border border-amber-500/50 bg-amber-500/5"
          >
            <div className="flex items-center mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Flame className="h-6 w-6 text-amber-500 mr-3" />
              </motion.div>
              <span className="text-amber-400 font-medium">
                {forgingSteps[forgingStep]}
              </span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full"
                initial={{ width: "0%" }}
                animate={{ 
                  width: isPending ? "50%" : isConfirming ? "90%" : isSuccess ? "100%" : "0%"
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <div className="mt-3 text-sm text-gray-400 text-center">
              {statusMessage || (
                isPending ? "Confirm transaction in your wallet..." :
                isConfirming ? "Waiting for blockchain confirmation..." :
                isSuccess ? "🎉 Weapon successfully forged!" :
                "Ready to forge..."
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forge Button */}
      <div className="space-y-4">
        <motion.button
          whileHover={selectedWeapon && !isForging ? { scale: 1.02 } : {}}
          whileTap={selectedWeapon && !isForging ? { scale: 0.98 } : {}}
          onClick={handleForge}
          disabled={!selectedWeapon || isForging || isProcessing}
          className="btn-primary w-full py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isForging ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-3"
              >
                <Hammer className="h-6 w-6" />
              </motion.div>
              {isPending ? 'Confirm in Wallet...' : 'Forging...'}
            </>
          ) : (
            <>
              <Hammer className="h-6 w-6 mr-3" />
              Forge Weapon
            </>
          )}
        </motion.button>
        
        {/* Warning Messages */}
        {!selectedWeapon && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center text-blue-400 text-sm bg-blue-500/10 border border-blue-500/30 rounded-lg p-3"
          >
            <Sparkles className="h-4 w-4 mr-2 flex-shrink-0" />
            Select a weapon type and tier to begin forging
          </motion.div>
        )}
      </div>
    </div>
  );
}