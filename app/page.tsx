'use client';

import { Header } from '@/components/Header';
import { ConnectWallet } from '@/components/ConnectWallet';
import { PlayerStats } from '@/components/PlayerStats';
import { Forge } from '../components/Forge';
import { Inventory } from '../components/Inventory';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';

export default function Home() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Header />
          <ConnectWallet />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 xl:grid-cols-4 gap-8"
        >
          {/* Main Forge Area */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-3"
          >
            <Forge />
          </motion.div>
          
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <PlayerStats />
            <Inventory />
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}