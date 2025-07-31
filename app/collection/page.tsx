// src/app/collection/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { Header } from '@/components/Header';
import { CollectionGrid } from '@/components/CollectionGrid';
import { CollectionFilters } from '@/components/CollectionFilters';
import { CollectionStats } from '@/components/CollectionStats';
import { BLACKSMITH_CONTRACT_ADDRESS, BLACKSMITH_ABI } from '@/lib/contracts';
import { WeaponType, Rarity, type Weapon } from '@/types/game';
import { type FilterState } from '@/types/collection';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List } from 'lucide-react';

export default function CollectionPage() {
  const { address, isConnected } = useAccount();
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [filteredWeapons, setFilteredWeapons] = useState<Weapon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>({
    weaponType: 'all',
    rarity: 'all',
    tier: 'all',
    sortBy: 'newest'
  });

  // Fetch player's weapons
  const { data: weaponIds } = useReadContract({
    address: BLACKSMITH_CONTRACT_ADDRESS,
    abi: BLACKSMITH_ABI,
    functionName: 'getPlayerWeapons',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    }
  });

  // Mock data for demonstration - replace with actual contract calls
  useEffect(() => {
    const fetchWeapons = async () => {
      if (!weaponIds || weaponIds.length === 0) {
        setWeapons([]);
        setFilteredWeapons([]);
        return;
      }

      setIsLoading(true);
      try {
        // In a real implementation, you'd fetch each weapon's details from the contract
        // For now, we'll use mock data
        const mockWeapons: Weapon[] = weaponIds.map((id, index) => ({
          tokenId: id.toString(),
          weaponType: (index % 3) as WeaponType,
          tier: Math.min(Math.floor(index / 3) + 1, 10),
          rarity: (index % 5) as Rarity,
          damage: 30 + index * 5,
          durability: 50 + index * 3,
          speed: 40 + index * 2,
          craftedAt: Date.now() - index * 86400000,
          craftedBy: address!,
          ipfsHash: `QmMock${index}`,
        }));
        
        setWeapons(mockWeapons);
      } catch (error) {
        console.error('Failed to fetch weapons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeapons();
  }, [weaponIds, address]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...weapons];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(weapon => 
        weapon.tokenId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.weaponType !== 'all') {
      filtered = filtered.filter(weapon => weapon.weaponType === filters.weaponType);
    }
    if (filters.rarity !== 'all') {
      filtered = filtered.filter(weapon => weapon.rarity === filters.rarity);
    }
    if (filters.tier !== 'all') {
      filtered = filtered.filter(weapon => weapon.tier === filters.tier);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return b.craftedAt - a.craftedAt;
        case 'oldest':
          return a.craftedAt - b.craftedAt;
        case 'rarity':
          return b.rarity - a.rarity;
        case 'stats':
          return (b.damage + b.durability + b.speed) - (a.damage + a.durability + a.speed);
        default:
          return 0;
      }
    });

    setFilteredWeapons(filtered);
  }, [weapons, searchQuery, filters]);

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
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400">
              Connect your wallet to explore your weapon collection and discover other forged weapons.
            </p>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Weapon Collection</h1>
              <p className="text-gray-400">
                Explore and manage your forged weapons
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <CollectionStats weapons={weapons} />
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by token ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none"
              />
            </div>
            
            {/* Filter Toggle */}
            <button className="lg:hidden btn-secondary flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>

          <CollectionFilters filters={filters} onFiltersChange={setFilters} />
        </motion.div>

        {/* Collection Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CollectionGrid 
            weapons={filteredWeapons} 
            isLoading={isLoading}
            viewMode={viewMode}
          />
        </motion.div>
      </div>
    </main>
  );
}