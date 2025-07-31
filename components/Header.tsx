'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Hammer, Sword, Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between py-6 px-4 glass-card mb-8"
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Hammer className="h-10 w-10 text-amber-500" />
          </motion.div>
          <motion.div 
            className="absolute -top-1 -right-1"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles className="h-5 w-5 text-yellow-400" />
          </motion.div>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            Blacksmith Forge
          </h1>
          <p className="text-gray-400 text-sm">Craft Legendary Weapons as NFTs</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="hidden md:flex items-center space-x-2 text-gray-300">
          <Shield className="h-5 w-5 text-blue-400" />
          <span className="text-sm font-medium">Avalanche Network</span>
        </div>
        
        <div className="hidden sm:flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-400">
            <Sword className="h-4 w-4" />
            <span className="text-xs">Fast</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <Shield className="h-4 w-4" />
            <span className="text-xs">Secure</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs">Unique</span>
          </div>
        </div>
        
        <ConnectButton />
      </div>
    </motion.header>
  );
}