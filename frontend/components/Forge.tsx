'use client';

import { WeaponSelector } from './WeaponSelector';
import { ForgeInterface } from './ForgeInterface';
import { Flame, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Forge() {

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="weapon-card forge-glow"
      >
        <div className="flex items-center mb-8">
          <div className="relative mr-4">
            <motion.div>
              <Flame className="h-10 w-10 text-orange-500" />
            </motion.div>
            <motion.div
              className="absolute inset-0"
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
          >
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WeaponSelector />
          <ForgeInterface />
        </div>
      </motion.div>
    </div>
  );
}