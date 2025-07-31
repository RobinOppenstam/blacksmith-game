'use client';

import { WeaponType, Rarity } from '@/types/game';
import { type FilterState } from '@/types/collection';
import { Sword, Target, Zap, Star, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CollectionFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function CollectionFilters({ filters, onFiltersChange }: CollectionFiltersProps) {
  const weaponTypes = [
    { type: 'all' as const, label: 'All Types', icon: Star },
    { type: WeaponType.SWORD, label: 'Swords', icon: Sword },
    { type: WeaponType.BOW, label: 'Bows', icon: Target },
    { type: WeaponType.AXE, label: 'Axes', icon: Zap },
  ];

  const rarities = [
    { rarity: 'all' as const, label: 'All Rarities', color: 'text-gray-400' },
    { rarity: Rarity.COMMON, label: 'Common', color: 'text-gray-400' },
    { rarity: Rarity.UNCOMMON, label: 'Uncommon', color: 'text-green-400' },
    { rarity: Rarity.RARE, label: 'Rare', color: 'text-blue-400' },
    { rarity: Rarity.EPIC, label: 'Epic', color: 'text-purple-400' },
    { rarity: Rarity.LEGENDARY, label: 'Legendary', color: 'text-yellow-400' },
  ];

  const tiers = [
    { tier: 'all' as const, label: 'All Tiers' },
    ...Array.from({ length: 10 }, (_, i) => ({
      tier: i + 1,
      label: `Tier ${i + 1}`
    }))
  ];

  const sortOptions = [
    { value: 'newest' as const, label: 'Newest First' },
    { value: 'oldest' as const, label: 'Oldest First' },
    { value: 'rarity' as const, label: 'Rarity (High to Low)' },
    { value: 'stats' as const, label: 'Total Stats (High to Low)' },
  ];

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      weaponType: 'all',
      rarity: 'all',
      tier: 'all',
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = filters.weaponType !== 'all' || 
                          filters.rarity !== 'all' || 
                          filters.tier !== 'all' ||
                          filters.sortBy !== 'newest';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Weapon Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Weapon Type
          </label>
          <div className="space-y-2">
            {weaponTypes.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => updateFilter('weaponType', type)}
                className={clsx(
                  'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                  filters.weaponType === type
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rarity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Rarity
          </label>
          <div className="space-y-2">
            {rarities.map(({ rarity, label, color }) => (
              <button
                key={rarity}
                onClick={() => updateFilter('rarity', rarity)}
                className={clsx(
                  'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                  filters.rarity === rarity
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : `${color} hover:bg-gray-700/50`
                )}
              >
                <div className={clsx('w-3 h-3 rounded-full', 
                  rarity === 'all' ? 'bg-gray-400' :
                  rarity === Rarity.COMMON ? 'bg-gray-400' :
                  rarity === Rarity.UNCOMMON ? 'bg-green-400' :
                  rarity === Rarity.RARE ? 'bg-blue-400' :
                  rarity === Rarity.EPIC ? 'bg-purple-400' :
                  'bg-yellow-400'
                )} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tier Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Tier
          </label>
          <select
            value={filters.tier}
            onChange={(e) => updateFilter('tier', e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
          >
            {tiers.map(({ tier, label }) => (
              <option key={tier} value={tier}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
          >
            {sortOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
}