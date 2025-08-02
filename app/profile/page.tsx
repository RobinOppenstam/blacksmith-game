// src/app/profile/page.tsx
'use client';

import { useAccount } from 'wagmi';

// Disable static generation for this page
export const dynamic = 'force-dynamic';
import { Header } from '@/components/Header';
import { PlayerStats } from '@/components/PlayerStats';
import { useGame } from '@/contexts/GameContext';
import { motion } from 'framer-motion';
import { User, Trophy, Calendar, ExternalLink, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { state } = useGame();
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render wagmi-dependent content until mounted
  if (!mounted) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
        </div>
      </main>
    );
  }

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <User className="h-16 w-16 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400">
              Connect your wallet to view your blacksmith profile and achievements.
            </p>
          </motion.div>
        </div>
      </main>
    );
  }

  const totalWeapons = state.player ? 
    state.player.swordsCrafted + state.player.bowsCrafted + state.player.axesCrafted : 0;

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Profile Header */}
          <div className="weapon-card mb-8">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {state.player?.isRegistered ? 'Master Blacksmith' : 'Unregistered User'}
                </h1>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <span className="text-sm">Wallet:</span>
                    <code className="text-xs bg-gray-800 px-2 py-1 rounded">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </code>
                    <button
                      onClick={copyAddress}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {state.player?.isRegistered && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-amber-400">{state.player.level}</div>
                      <div className="text-sm text-gray-400">Level</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">{totalWeapons}</div>
                      <div className="text-sm text-gray-400">Weapons Forged</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">{state.player.experience}</div>
                      <div className="text-sm text-gray-400">Total XP</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-right">
                <a
                  href={`https://testnet.snowtrace.io/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View on Explorer
                </a>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Player Stats */}
            <div className="lg:col-span-1">
              <PlayerStats />
            </div>

            {/* Achievements & Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Achievements */}
              <div className="weapon-card">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Trophy className="h-6 w-6 mr-2 text-amber-500" />
                  Achievements
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Weapon */}
                  <div className={`p-4 rounded-lg border ${
                    totalWeapons > 0 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-gray-800/50 border-gray-700'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        totalWeapons > 0 ? 'bg-green-500' : 'bg-gray-600'
                      }`}>
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">First Forge</div>
                        <div className="text-sm text-gray-400">Craft your first weapon</div>
                      </div>
                    </div>
                  </div>

                  {/* Level 10 */}
                  <div className={`p-4 rounded-lg border ${
                    (state.player?.level || 0) >= 10
                      ? 'bg-blue-500/10 border-blue-500/30' 
                      : 'bg-gray-800/50 border-gray-700'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        (state.player?.level || 0) >= 10 ? 'bg-blue-500' : 'bg-gray-600'
                      }`}>
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Apprentice</div>
                        <div className="text-sm text-gray-400">Reach level 10</div>
                      </div>
                    </div>
                  </div>

                  {/* 10 Weapons */}
                  <div className={`p-4 rounded-lg border ${
                    totalWeapons >= 10
                      ? 'bg-purple-500/10 border-purple-500/30' 
                      : 'bg-gray-800/50 border-gray-700'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        totalWeapons >= 10 ? 'bg-purple-500' : 'bg-gray-600'
                      }`}>
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Prolific Crafter</div>
                        <div className="text-sm text-gray-400">Forge 10 weapons</div>
                      </div>
                    </div>
                  </div>

                  {/* Master Level */}
                  <div className={`p-4 rounded-lg border ${
                    (state.player?.level || 0) >= 50
                      ? 'bg-yellow-500/10 border-yellow-500/30' 
                      : 'bg-gray-800/50 border-gray-700'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        (state.player?.level || 0) >= 50 ? 'bg-yellow-500' : 'bg-gray-600'
                      }`}>
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Master Blacksmith</div>
                        <div className="text-sm text-gray-400">Reach level 50</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="weapon-card">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-amber-500" />
                  Recent Activity
                </h3>
                
                <div className="space-y-3 text-gray-400 text-sm">
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <span>Joined the forge</span>
                    <span>Today</span>
                  </div>
                  {totalWeapons > 0 && (
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <span>Forged first weapon</span>
                      <span>Today</span>
                    </div>
                  )}
                  {(state.player?.level || 0) > 1 && (
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <span>Reached level {state.player?.level}</span>
                      <span>Today</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}