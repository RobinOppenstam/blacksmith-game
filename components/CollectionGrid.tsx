'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Weapon, WeaponType, Rarity } from '@/types/game';
import { getWeaponTypeName, getRarityName, getRarityColor } from '@/lib/weapons';
import { getIPFSUrl } from '@/lib/ipfs';
import { Sword, Target, Zap, ExternalLink, Calendar, TrendingUp, Eye } from 'lucide-react';
import { clsx } from 'clsx';
import Image from 'next/image';

interface CollectionGridProps {
  weapons: Weapon[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
}

interface WeaponModalProps {
  weapon: Weapon;
  isOpen: boolean;
  onClose: () => void;
}

function WeaponModal({ weapon, isOpen, onClose }: WeaponModalProps) {
  if (!isOpen) return null;

  const weaponTypeName = getWeaponTypeName(weapon.weaponType);
  const rarityName = getRarityName(weapon.rarity);
  const rarityColor = getRarityColor(weapon.rarity);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-xl border border-gray-700 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <div className="relative w-48 h-48 mx-auto mb-4 rounded-lg overflow-hidden">
              <Image
                src="/api/placeholder/400/400" // You'll replace this with actual IPFS image
                alt={`${weaponTypeName} #${weapon.tokenId}`}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to generated placeholder
                  const target = e.target as HTMLImageElement;
                  target.src = `data:image/svg+xml,${encodeURIComponent(`
                    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                      <rect width="400" height="400" fill="#374151"/>
                      <text x="200" y="200" text-anchor="middle" fill="#9CA3AF" font-size="16" font-family="Arial">
                        ${weaponTypeName} #${weapon.tokenId}
                      </text>
                    </svg>
                  `)}`;
                }}
              />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">
              {weaponTypeName} #{weapon.tokenId}
            </h3>
            <span className={clsx('inline-block px-3 py-1 rounded-full text-sm font-medium border', rarityColor)}>
              {rarityName}
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <div className="text-red-400 font-bold text-lg">{weapon.damage}</div>
                <div className="text-xs text-gray-400">Damage</div>
              </div>
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <div className="text-blue-400 font-bold text-lg">{weapon.durability}</div>
                <div className="text-xs text-gray-400">Durability</div>
              </div>
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <div className="text-green-400 font-bold text-lg">{weapon.speed}</div>
                <div className="text-xs text-gray-400">Speed</div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Tier</span>
                <span className="text-white">{weapon.tier}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Total Stats</span>
                <span className="text-amber-400">{weapon.damage + weapon.durability + weapon.speed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Forged</span>
                <span className="text-white">{new Date(weapon.craftedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 btn-primary flex items-center justify-center">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </button>
              <button 
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function WeaponCard({ weapon, onClick }: { weapon: Weapon; onClick: () => void }) {
  const weaponIcons = {
    [WeaponType.SWORD]: Sword,
    [WeaponType.BOW]: Target,
    [WeaponType.AXE]: Zap,
  };

  const IconComponent = weaponIcons[weapon.weaponType];
  const weaponTypeName = getWeaponTypeName(weapon.weaponType);
  const rarityName = getRarityName(weapon.rarity);
  const rarityColor = getRarityColor(weapon.rarity);
  const totalStats = weapon.damage + weapon.durability + weapon.speed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={clsx(
        'weapon-card cursor-pointer relative group',
        rarityColor
      )}
      onClick={onClick}
    >
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
        <Eye className="h-8 w-8 text-white" />
      </div>

      {/* Weapon image placeholder */}
      <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        <Image
          src="/api/placeholder/300/300" // Replace with actual IPFS image URL
          alt={`${weaponTypeName} #${weapon.tokenId}`}
          width={300}
          height={300}
          className="object-cover w-full h-full"
          onError={(e) => {
            // Fallback to icon display
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-gray-400">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    ${weapon.weaponType === WeaponType.SWORD ? '<path d="M6.92 5H5l9-3.76L23 5h-1.92L12 15L6.92 5z"/>' :
                      weapon.weaponType === WeaponType.BOW ? '<path d="M4 8L2 12l2 4c4-2 8-2 12 0l2-4-2-4c-4 2-8 2-12 0z"/>' :
                      '<path d="M12 2L8 8h8l-4-6z M8 8v8l4-4 4 4V8H8z"/>'}
                  </svg>
                  <span class="text-xs mt-2">${weaponTypeName}</span>
                </div>
              `;
            }
          }}
        />
      </div>

      {/* Weapon info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <IconComponent className="h-5 w-5 text-gray-300" />
            <span className="font-medium text-white">#{weapon.tokenId}</span>
          </div>
          <span className={clsx('text-xs px-2 py-1 rounded-full border', rarityColor)}>
            {rarityName}
          </span>
        </div>

        <div className="text-sm text-gray-300">
          <div className="flex justify-between mb-1">
            <span>Tier {weapon.tier}</span>
            <span>{weaponTypeName}</span>
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-gray-800/50 rounded">
            <div className="text-red-400 font-bold">{weapon.damage}</div>
            <div className="text-gray-500">DMG</div>
          </div>
          <div className="text-center p-2 bg-gray-800/50 rounded">
            <div className="text-blue-400 font-bold">{weapon.durability}</div>
            <div className="text-gray-500">DUR</div>
          </div>
          <div className="text-center p-2 bg-gray-800/50 rounded">
            <div className="text-green-400 font-bold">{weapon.speed}</div>
            <div className="text-gray-500">SPD</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(weapon.craftedAt).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            {totalStats}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CollectionGrid({ weapons, isLoading, viewMode }: CollectionGridProps) {
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="weapon-card animate-pulse">
            <div className="w-full h-48 bg-gray-700 rounded-lg mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded" />
              <div className="h-3 bg-gray-700 rounded w-3/4" />
              <div className="grid grid-cols-3 gap-2">
                <div className="h-8 bg-gray-700 rounded" />
                <div className="h-8 bg-gray-700 rounded" />
                <div className="h-8 bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (weapons.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <Sword className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Weapons Found</h3>
        <p className="text-gray-400 mb-6">
          No weapons match your current filters. Try adjusting your search criteria.
        </p>
        <button className="btn-primary">
          Clear Filters
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <div className={clsx(
        'grid gap-6',
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
      )}>
        <AnimatePresence>
          {weapons.map((weapon) => (
            <WeaponCard
              key={weapon.tokenId}
              weapon={weapon}
              onClick={() => setSelectedWeapon(weapon)}
            />
          ))}
        </AnimatePresence>
      </div>

      <WeaponModal
        weapon={selectedWeapon!}
        isOpen={!!selectedWeapon}
        onClose={() => setSelectedWeapon(null)}
      />
    </>
  );
}