// src/app/api/weapon/[tokenId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BLACKSMITH_CONTRACT_ADDRESS, BLACKSMITH_ABI } from '@/lib/contracts';
import { createPublicClient, http } from 'viem';
import { avalancheFuji } from 'viem/chains';

const publicClient = createPublicClient({
  chain: avalancheFuji,
  transport: http()
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ tokenId: string }> }
) {
  try {
    const { tokenId } = await context.params;

    // Fetch weapon data from contract
    const weaponData = await publicClient.readContract({
      address: BLACKSMITH_CONTRACT_ADDRESS,
      abi: BLACKSMITH_ABI,
      functionName: 'getWeapon',
      args: [BigInt(tokenId)],
    });

    // Fetch metadata from IPFS
    let metadata = null;
    if (weaponData.ipfsHash && weaponData.ipfsHash !== '' && !weaponData.ipfsHash.startsWith('temp_') && !weaponData.ipfsHash.startsWith('fallback_')) {
      try {
        const { fetchFromIPFS } = await import('@/lib/ipfs');
        
        console.log(`Fetching metadata for token ${tokenId} from IPFS hash: ${weaponData.ipfsHash}`);
        
        const metadataResponse = await fetchFromIPFS(weaponData.ipfsHash, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
          },
        });

        if (metadataResponse.ok) {
          metadata = await metadataResponse.json();
          console.log(`Successfully fetched metadata for token ${tokenId}:`, metadata);
        } else {
          console.warn(`Failed to fetch metadata for token ${tokenId}:`, metadataResponse.status, metadataResponse.statusText);
        }
      } catch (error) {
        console.warn(`Failed to fetch metadata from IPFS for token ${tokenId}:`, error);
      }
    } else {
      console.log(`Skipping metadata fetch for token ${tokenId} - invalid hash: ${weaponData.ipfsHash}`);
    }

    const weapon = {
      tokenId,
      weaponType: Number(weaponData.weaponType),
      tier: Number(weaponData.tier),
      rarity: Number(weaponData.rarity),
      damage: Number(weaponData.damage),
      durability: Number(weaponData.durability),
      speed: Number(weaponData.speed),
      craftedAt: Number(weaponData.craftedAt),
      craftedBy: weaponData.craftedBy,
      ipfsHash: weaponData.ipfsHash,
      metadata
    };

    return NextResponse.json(weapon);

  } catch (error: any) {
    console.error('Failed to fetch weapon data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch weapon data' },
      { status: 500 }
    );
  }
}