'use client';

import { useGame } from '@/contexts/GameContext';
import { WeaponSelector } from './WeaponSelector';
import { ForgeInterface } from './ForgeInterface';
import { Flame, Hammer, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Forge() {
  const { state } = useGame();

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="weapon-card forge-glow animate-forge-pulse"
      >
        <div className="flex items-center mb-8">
          <div className="relative mr-4">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Flame className="h-10 w-10 text-orange-500" />
            </motion.div>
            <motion.div
              className="absolute inset-0"
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity 
              }}
            >
              <Flame className="h-10 w-10 text-red-500" />
            </motion.div>
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">The Forge</h2>
            <p className="text-gray-400 mt-1">Craft legendary weapons and mint them as NFTs</p>
          </div>
          <motion.div
            className="ml-auto"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </motion.div>
        </div>

        {!state.player?.isRegistered ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Hammer className="h-20 w-20 text-gray-600 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-xl text-gray-400 mb-2">Forge Access Denied</h3>
            <p className="text-gray-500">Register as a blacksmith to access the forge</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <WeaponSelector />
            <ForgeInterface />
          </div>
        )}
      </motion.div>
    </div>
  );
}