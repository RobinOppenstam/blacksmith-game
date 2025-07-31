import React from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { BLACKSMITH_CONTRACT_ADDRESS, BLACKSMITH_ABI } from '@/lib/contracts';
import { parseEther } from 'viem';
import { WeaponType } from '@/types/game';
import { useGame } from '@/contexts/GameContext';
import { generateWeaponMetadata, uploadMetadataToIPFS } from '@/lib/ipfs';
import { WEAPON_DEFINITIONS } from '@/lib/weapons';

export function useBlacksmith() {
  const { refetchPlayer } = useGame();
  const { address } = useAccount(); // Get wallet address
  const { 
    writeContract, 
    data: hash, 
    isPending: isWritePending,
    error: writeError 
  } = useWriteContract();
  
  const { 
    isLoading: isConfirming, 
    isSuccess,
    error: receiptError 
  } = useWaitForTransactionReceipt({
    hash,
  });

  const registerPlayer = async () => {
    try {
      console.log('Registering player...');
      const result = await writeContract({
        address: BLACKSMITH_CONTRACT_ADDRESS,
        abi: BLACKSMITH_ABI,
        functionName: 'registerPlayer',
      });
      console.log('Registration transaction sent:', result);
      return result;
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // Parse common error messages
      if (error?.message?.includes('ALREADY_REGISTERED')) {
        throw new Error('You are already registered as a blacksmith!');
      } else if (error?.message?.includes('User rejected')) {
        throw new Error('Transaction was rejected by user');
      } else if (error?.message?.includes('insufficient funds')) {
        throw new Error('Insufficient funds for gas fees');
      }
      
      throw new Error(error?.message || 'Registration failed');
    }
  };

  const forgeWeapon = async (
    weaponType: WeaponType,
    tier: number,
    customImage?: File
  ) => {
    try {
      console.log('Starting weapon forge process...', { weaponType, tier });
      
      // Validate inputs before processing
      if (weaponType < 0 || weaponType > 2) {
        throw new Error('Invalid weapon type');
      }
      if (tier < 1 || tier > 10) {
        throw new Error('Invalid weapon tier');
      }

      // Get weapon definition for metadata
      const weaponDef = WEAPON_DEFINITIONS[weaponType][tier - 1];
      if (!weaponDef) {
        throw new Error('Weapon definition not found');
      }

      // Generate estimated stats for metadata (will be randomized on-chain)
      const estimatedDamage = weaponDef.baseStats.damage + Math.floor(Math.random() * 20) - 10;
      const estimatedDurability = weaponDef.baseStats.durability + Math.floor(Math.random() * 16) - 8;
      const estimatedSpeed = weaponDef.baseStats.speed + Math.floor(Math.random() * 12) - 6;
      const estimatedRarity = Math.floor(Math.random() * 5); // Will be determined on-chain

      // Generate temporary token ID for metadata
      const tempTokenId = `temp_${Date.now()}`;

      console.log('Generating weapon image...');
      
      // Generate weapon image
      let imageIpfsHash = '';
      try {
        // Import the image generator (dynamic import to avoid SSR issues)
        const { createWeaponImageFile } = await import('@/lib/weaponImageGenerator');
        
        const imageConfig = {
          width: 400,
          height: 400,
          weaponType,
          tier,
          rarity: estimatedRarity,
          damage: Math.max(1, estimatedDamage),
          durability: Math.max(1, estimatedDurability),
          speed: Math.max(1, estimatedSpeed)
        };
        
        const imageFile = await createWeaponImageFile(imageConfig);
        console.log('Generated weapon image file:', imageFile.name);
        
        // Upload image to IPFS
        console.log('Uploading image to IPFS...');
        const weaponInfo = { weaponType, tier, rarity: estimatedRarity, tokenId: tempTokenId };
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('weaponInfo', JSON.stringify(weaponInfo));
        
        const imageResponse = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });
        
        if (imageResponse.ok) {
          const { ipfsHash } = await imageResponse.json();
          imageIpfsHash = ipfsHash;
          console.log('Image uploaded to IPFS:', imageIpfsHash);
        } else {
          console.warn('Image upload failed, proceeding without custom image');
        }
      } catch (imageError) {
        console.warn('Image generation/upload failed:', imageError);
        // Continue without image - will use placeholder
      }

      console.log('Generating weapon metadata...');
      
      // Generate metadata with proper wallet address
      const metadata = generateWeaponMetadata(
        weaponType,
        tier,
        estimatedRarity,
        Math.max(1, estimatedDamage),
        Math.max(1, estimatedDurability), 
        Math.max(1, estimatedSpeed),
        tempTokenId,
        address || 'Unknown', // Use actual wallet address
        imageIpfsHash
      );

      console.log('Uploading metadata to IPFS...');
      
      // Upload metadata to IPFS
      let metadataIpfsHash: string;
      try {
        const ipfsUrl = await uploadMetadataToIPFS(metadata);
        metadataIpfsHash = ipfsUrl.replace('ipfs://', '');
        console.log('Metadata uploaded to IPFS:', metadataIpfsHash);
      } catch (ipfsError) {
        console.warn('IPFS metadata upload failed, using fallback:', ipfsError);
        // Fallback to a temporary hash
        metadataIpfsHash = `fallback_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      }

      console.log('Sending forge transaction...');
      
      const result = await writeContract({
        address: BLACKSMITH_CONTRACT_ADDRESS,
        abi: BLACKSMITH_ABI,
        functionName: 'forgeWeapon',
        args: [weaponType, tier, metadataIpfsHash],
        value: parseEther('0.001'),
      });
      
      console.log('Forge transaction sent:', result);
      return { hash: result, ipfsHash: metadataIpfsHash, metadata, imageIpfsHash };
      
    } catch (error: any) {
      console.error('Forging failed:', error);
      
      // Parse common error messages
      if (error?.message?.includes('INSUFFICIENT_FEE')) {
        throw new Error('Insufficient AVAX sent (need 0.001 AVAX)');
      } else if (error?.message?.includes('NOT_REGISTERED')) {
        throw new Error('You must register as a blacksmith first');
      } else if (error?.message?.includes('LEVEL_TOO_LOW')) {
        throw new Error('Your level is too low for this weapon tier');
      } else if (error?.message?.includes('INVALID_TIER')) {
        throw new Error('Invalid weapon tier selected');
      } else if (error?.message?.includes('USER_REJECTED')) {
        throw new Error('Transaction was rejected by user');
      } else if (error?.message?.includes('insufficient funds')) {
        throw new Error('Insufficient AVAX balance');
      }
      
      throw new Error(error?.shortMessage || error?.message || 'Forging failed');
    }
  };

  // Refetch player data when transaction is successful
  React.useEffect(() => {
    if (isSuccess) {
      console.log('Transaction successful, refetching player data...');
      setTimeout(() => {
        refetchPlayer();
      }, 2000); // Wait a bit for blockchain to update
    }
  }, [isSuccess, refetchPlayer]);

  // Log errors for debugging
  React.useEffect(() => {
    if (writeError) {
      console.error('Write error:', writeError);
    }
    if (receiptError) {
      console.error('Receipt error:', receiptError);
    }
  }, [writeError, receiptError]);

  return {
    registerPlayer,
    forgeWeapon,
    isPending: isWritePending,
    isConfirming,
    isSuccess,
    hash,
    error: writeError || receiptError,
  };
}