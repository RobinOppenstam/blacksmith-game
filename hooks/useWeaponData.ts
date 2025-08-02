// src/hooks/useWeaponData.ts
import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { BLACKSMITH_CONTRACT_ADDRESS, BLACKSMITH_ABI } from '@/lib/contracts';
import { type Weapon } from '@/types/game';
import { getIPFSUrl } from '@/lib/ipfs';

export function useWeaponData(tokenId: string) {
  const [weaponWithMetadata, setWeaponWithMetadata] = useState<(Weapon & { imageUrl?: string; metadata?: any }) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch weapon data from contract
  const { 
    data: weaponData, 
    isLoading: isContractLoading,
    error: contractError 
  } = useReadContract({
    address: BLACKSMITH_CONTRACT_ADDRESS,
    abi: BLACKSMITH_ABI,
    functionName: 'getWeapon',
    args: [BigInt(tokenId)],
    query: {
      enabled: !!tokenId,
    }
  });

  useEffect(() => {
    async function fetchMetadata() {
      if (!weaponData || isContractLoading) return;

      setIsLoading(true);
      setError(null);

      try {
        // Convert contract data to Weapon type
        const weapon: Weapon = {
          tokenId,
          weaponType: Number(weaponData.weaponType),
          tier: Number(weaponData.tier),
          rarity: Number(weaponData.rarity),
          damage: Number(weaponData.damage),
          durability: Number(weaponData.durability),
          speed: Number(weaponData.speed),
          craftedAt: Number(weaponData.craftedAt) * 1000, // Convert to milliseconds
          craftedBy: weaponData.craftedBy,
          ipfsHash: weaponData.ipfsHash,
        };

        let imageUrl = '';
        let metadata = null;

        // Fetch metadata from IPFS if available
        if (weaponData.ipfsHash && weaponData.ipfsHash !== '') {
          try {
            const metadataUrl = weaponData.ipfsHash.startsWith('ipfs://') 
              ? getIPFSUrl(weaponData.ipfsHash)
              : getIPFSUrl(`ipfs://${weaponData.ipfsHash}`);
            
            console.log('Fetching metadata from:', metadataUrl);
            
            const metadataResponse = await fetch(metadataUrl, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
            });

            if (metadataResponse.ok) {
              metadata = await metadataResponse.json();
              console.log('Fetched metadata:', metadata);
              
              // Extract image URL from metadata
              if (metadata.image) {
                // Debug: Log the raw image URL
                console.log('Raw image URL from metadata:', metadata.image);
                
                // Handle different image URL formats
                if (metadata.image.startsWith('ipfs://')) {
                  imageUrl = getIPFSUrl(metadata.image);
                } else if (metadata.image.startsWith('http')) {
                  imageUrl = metadata.image;
                } else if (metadata.image.includes('mypinata.cloud')) {
                  // Handle malformed Pinata URLs
                  const ipfsHash = metadata.image.split('mypinata.cloud')[1];
                  imageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
                } else {
                  // Assume it's just an IPFS hash
                  imageUrl = `https://gateway.pinata.cloud/ipfs/${metadata.image}`;
                }
                
                console.log('Processed image URL:', imageUrl);
              }
            } else {
              console.warn('Failed to fetch metadata:', metadataResponse.status, metadataResponse.statusText);
            }
          } catch (metadataError) {
            console.warn('Error fetching metadata:', metadataError);
          }
        }

        setWeaponWithMetadata({
          ...weapon,
          imageUrl,
          metadata,
        });

      } catch (err) {
        console.error('Error processing weapon data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch weapon data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetadata();
  }, [weaponData, tokenId, isContractLoading]);

  return {
    weapon: weaponWithMetadata,
    isLoading: isContractLoading || isLoading,
    error: contractError?.message || error,
  };
}

// Batch processing utility to limit concurrent requests
async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 3,
  delayMs: number = 100
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
    
    // Add small delay between batches to avoid overwhelming the server
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return results;
}

// Simple cache to prevent duplicate API calls
const weaponCache = new Map<string, Promise<any>>();

// Hook to fetch multiple weapons
export function useMultipleWeaponsData(tokenIds: readonly bigint[]) {
  const [weapons, setWeapons] = useState<(Weapon & { imageUrl?: string; metadata?: any })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedCount, setFailedCount] = useState(0);

  useEffect(() => {
    async function fetchAllWeapons() {
      if (!tokenIds || tokenIds.length === 0) {
        setWeapons([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      setFailedCount(0);

      try {
        console.log(`Starting to fetch ${tokenIds.length} weapons in batches...`);
        
        const weaponProcessor = async (tokenId: bigint) => {
          const tokenIdStr = tokenId.toString();
          
          // Check cache first
          if (weaponCache.has(tokenIdStr)) {
            console.log(`Using cached data for weapon ${tokenId}`);
            return await weaponCache.get(tokenIdStr);
          }
          
          // Create and cache the promise
          const fetchPromise = (async () => {
            try {
              console.log(`Fetching weapon ${tokenId}...`);
              
              // Use the weapon API route with timeout
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
              
              const response = await fetch(`/api/weapon/${tokenIdStr}`, {
                signal: controller.signal,
              });
              
              clearTimeout(timeoutId);
              
              if (response.ok) {
                const weaponData = await response.json();
                console.log(`Weapon ${tokenId} data received`);
                
                // Process image URL using the new IPFS utilities
                let imageUrl = '';
                if (weaponData.metadata?.image) {
                  const { getIPFSUrl } = await import('@/lib/ipfs');
                  const rawImageUrl = weaponData.metadata.image;
                  console.log(`Processing image URL for weapon ${tokenId}:`, rawImageUrl);
                  
                  try {
                    imageUrl = getIPFSUrl(rawImageUrl);
                    console.log(`Processed image URL for weapon ${tokenId}:`, imageUrl);
                  } catch (imgError) {
                    console.warn(`Failed to process image URL for weapon ${tokenId}:`, imgError);
                  }
                }

                return {
                  ...weaponData,
                  imageUrl,
                };
              } else {
                console.warn(`Failed to fetch weapon ${tokenId}:`, response.status, response.statusText);
                return null;
              }
            } catch (err) {
              if (err instanceof Error && err.name === 'AbortError') {
                console.error(`Timeout fetching weapon ${tokenId}`);
              } else {
                console.error(`Error fetching weapon ${tokenId}:`, err);
              }
              return null;
            }
          })();
          
          weaponCache.set(tokenIdStr, fetchPromise);
          
          // Clean up cache after 5 minutes
          setTimeout(() => {
            weaponCache.delete(tokenIdStr);
          }, 5 * 60 * 1000);
          
          return await fetchPromise;
        };

        // Process weapons in batches of 3 with 200ms delay between batches
        const results = await processBatch(
          Array.from(tokenIds), 
          weaponProcessor, 
          3, 
          200
        );
        
        const validWeapons = results.filter(weapon => weapon !== null);
        const failed = results.length - validWeapons.length;
        
        console.log(`Weapon fetch complete: ${validWeapons.length} successful, ${failed} failed`);
        
        setWeapons(validWeapons);
        setFailedCount(failed);
        
        if (failed > 0 && validWeapons.length === 0) {
          setError(`Failed to load any weapons. Please check your connection and try again.`);
        } else if (failed > 0) {
          setError(`Some weapons failed to load (${failed}/${results.length}). Images may be missing.`);
        }
        
      } catch (err) {
        console.error('Error fetching weapons:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch weapons');
        setWeapons([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllWeapons();
  }, [tokenIds]);

  return {
    weapons,
    isLoading,
    error,
    failedCount,
  };
}