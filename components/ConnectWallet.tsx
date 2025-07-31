'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Hammer, Sparkles, Trophy, Coins, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Hammer,
    title: 'Forge Weapons',
    description: 'Craft swords, bows, and axes with unique stats and rarities',
    color: 'text-amber-500',
  },
  {
    icon: Trophy,
    title: 'Level Up',
    description: 'Gain experience and unlock new weapon tiers as you progress',
    color: 'text-blue-500',
  },
  {
    icon: Coins,
    title: 'Own NFTs',
    description: 'Every weapon you forge becomes a unique NFT you can trade or keep',
    color: 'text-green-500',
  },
];

const stats = [
  { label: 'Weapon Types', value: '3', icon: Hammer },
  { label: 'Tiers Per Type', value: '10', icon: Trophy },
  { label: 'Max Level', value: '100', icon: Zap },
  { label: 'Blockchain', value: 'AVAX', icon: Shield },
];

export function ConnectWallet() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="relative inline-block mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Hammer className="h-24 w-24 text-amber-500 mx-auto" />
            </motion.div>
            <motion.div
              className="absolute -top-4 -right-4"
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity 
              }}
            >
              <Sparkles className="h-12 w-12 text-yellow-400" />
            </motion.div>
          </div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold gradient-text mb-6"
          >
            Welcome to the Forge
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Craft legendary weapons, level up your skills, and mint unique NFTs on the Avalanche blockchain
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.2 }}
              className="glass-card p-8 hover:bg-white/10 transition-all duration-300 group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <feature.icon className={`h-12 w-12 ${feature.color} mx-auto mb-4 group-hover:animate-pulse`} />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4 }}
          className="glass-card p-8 mb-12"
        >
          <h3 className="text-2xl font-semibold text-white mb-6">Game Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="glass-card p-8 mb-8"
        >
          <h3 className="text-2xl font-semibold text-white mb-4">Ready to Begin?</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect your wallet to start your blacksmithing journey. 
            You'll need some AVAX to pay for minting fees (~0.01 AVAX per weapon).
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ConnectButton />
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0 }}
          className="text-sm text-gray-500 space-y-2"
        >
          <p>Powered by Avalanche C-Chain • Built with Next.js & RainbowKit</p>
          <p className="flex items-center justify-center space-x-4">
            <span>⚡ Fast transactions</span>
            <span>💸 Low fees</span>
            <span>🔒 Secure</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}