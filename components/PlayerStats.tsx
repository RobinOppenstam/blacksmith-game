'use client';

import { useGame } from '@/contexts/GameContext';
import { User, Star, Sword, Target, Zap, Crown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function PlayerStats() {
  const { state } = useGame();
  // Show welcome message for new players (level 0)
  if (!state.player || state.player.level === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="weapon-card"
      >
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <User className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-xl font-semibold text-white mb-2">Welcome, Blacksmith!</h3>
          <p className="text-gray-400 text-sm mb-6">
            Start forging your first weapon to automatically join the guild and begin your journey.
          </p>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <div className="text-xs text-amber-400 font-medium mb-1">Getting Started</div>
            <div className="text-sm text-gray-300">
              Choose a weapon type and tier to forge your first legendary item!
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const { player } = state;
  const experienceProgress = (player.experience % 1000) / 1000 * 100;
  const totalWeapons = player.swordsCrafted + player.bowsCrafted + player.axesCrafted;
  const nextLevelExp = 1000 - (player.experience % 1000);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="weapon-card"
    >
      <div className="flex items-center mb-6">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Crown className="h-6 w-6 text-amber-500 mr-3" />
        </motion.div>
        <h3 className="text-xl font-semibold gradient-text">Blacksmith Stats</h3>
      </div>
      
      <div className="space-y-6">
        {/* Level and Experience */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-300 flex items-center font-medium">
              <Star className="h-5 w-5 mr-2 text-yellow-400" />
              Level {player.level}
            </span>
            <span className="text-sm text-gray-400">
              {nextLevelExp} XP to next level
            </span>
          </div>
          <div className="stat-bar">
            <motion.div 
              className="stat-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${experienceProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{player.experience % 1000} XP</span>
            <span>1000 XP</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 bg-gray-700/30 rounded-lg border border-gray-600"
          >
            <div className="text-3xl font-bold gradient-text">{totalWeapons}</div>
            <div className="text-xs text-gray-400 flex items-center justify-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Total Forged
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 bg-gray-700/30 rounded-lg border border-gray-600"
          >
            <div className="text-3xl font-bold text-amber-500">{player.level}</div>
            <div className="text-xs text-gray-400 flex items-center justify-center mt-1">
              <Crown className="h-3 w-3 mr-1" />
              Current Level
            </div>
          </motion.div>
        </div>

        {/* Weapon Mastery */}
        <div className="border-t border-gray-700 pt-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center">
            <Sword className="h-4 w-4 mr-2" />
            Weapon Mastery
          </h4>
          <div className="space-y-3">
            {[
              { icon: Sword, label: 'Swords', count: player.swordsCrafted, color: 'text-blue-400' },
              { icon: Target, label: 'Bows', count: player.bowsCrafted, color: 'text-green-400' },
              { icon: Zap, label: 'Axes', count: player.axesCrafted, color: 'text-orange-400' },
            ].map((weapon, index) => (
              <motion.div
                key={weapon.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center p-2 bg-gray-800/30 rounded"
              >
                <span className={`text-sm flex items-center ${weapon.color}`}>
                  <weapon.icon className="h-4 w-4 mr-2" />
                  {weapon.label}
                </span>
                <div className="flex items-center">
                  <span className="text-white font-medium mr-2">{weapon.count}</span>
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${weapon.color.replace('text-', 'bg-')}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((weapon.count / 10) * 100, 100)}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Next Unlock */}
        {player.level < 100 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <div className="text-xs text-amber-400 font-medium mb-1">Next Unlock</div>
            <div className="text-sm text-gray-300">
              {player.level < 91 ? 
                `Tier ${Math.floor(player.level / 10) + 2} weapons at level ${(Math.floor(player.level / 10) + 1) * 10 + 1}` :
                "Max level reached! 🎉"
              }
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}