import React, { useState, useRef } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract, usePublicClient } from 'wagmi';
import { BLACKSMITH_CONTRACT_ADDRESS, BLACKSMITH_ABI } from '@/lib/contracts';
import { parseEther } from 'viem';
import { WeaponType } from '@/types/game';
import { useGame } from '@/contexts/GameContext';
import { generateWeaponMetadata, uploadMetadataToIPFS } from '@/lib/ipfs';
import { WEAPON_DEFINITIONS } from '@/lib/weapons';

export function useBlacksmith() {
  const { refetchPlayer } = useGame();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  
  // Transaction queue management
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'preparing' | 'submitted' | 'confirming' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const lastTransactionTime = useRef<number>(0);
  
  const { 
    writeContract, 
    data: hash, 
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite
  } = useWriteContract();
  
  const { 
    isLoading: isConfirming, 
    isSuccess,
    error: receiptError 
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Get minting fee from contract
  const { data: mintingFee } = useReadContract({
    address: BLACKSMITH_CONTRACT_ADDRESS,
    abi: BLACKSMITH_ABI,
    functionName: 'MINTING_FEE',
  });

  // Get gas estimate for forging
  const { data: gasEstimate } = useReadContract({
    address: BLACKSMITH_CONTRACT_ADDRESS,
    abi: BLACKSMITH_ABI,
    functionName: 'estimateForgeGas',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });


  const forgeWeapon = async (
    weaponType: WeaponType,
    tier: number,
    customImage?: File
  ) => {
    // Prevent rapid-fire transactions
    const now = Date.now();
    if (now - lastTransactionTime.current < 3000) { // 3 second cooldown
      throw new Error('Please wait 3 seconds between transactions to prevent nonce conflicts');
    }
    
    // Prevent multiple simultaneous transactions
    if (isProcessing || isWritePending || isConfirming) {
      throw new Error('Transaction already in progress. Please wait for completion.');
    }
    
    try {
      setIsProcessing(true);
      setTransactionStatus('preparing');
      setStatusMessage('Preparing transaction...');
      resetWrite(); // Clear any previous transaction state
      lastTransactionTime.current = now;
      
      console.log('Starting weapon forge process...', { weaponType, tier });
      
      if (!address) {
        throw new Error('Wallet not connected');
      }
      
      console.log('Starting forge for address:', address);
      
      // Get current nonce with pending transactions
      if (!publicClient) {
        throw new Error('Public client not available');
      }
      
      setStatusMessage('Checking transaction queue...');
      const nonce = await publicClient.getTransactionCount({
        address: address,
        blockTag: 'pending'
      });
      console.log('Current nonce (including pending):', nonce);
      
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

      setStatusMessage('Submitting transaction...');
      setTransactionStatus('submitted');
      
      console.log('Sending forge transaction...');
      console.log('Using minting fee:', mintingFee?.toString());
      console.log('Using gas estimate:', gasEstimate?.toString());
      console.log('Using nonce:', nonce);
      
      // Calculate gas limit with 50% buffer for better reliability
      const gasLimit = gasEstimate ? BigInt(Math.floor(Number(gasEstimate) * 1.5)) : undefined;
      
      const result = await writeContract({
        address: BLACKSMITH_CONTRACT_ADDRESS,
        abi: BLACKSMITH_ABI,
        functionName: 'forgeWeapon',
        args: [weaponType, tier, metadataIpfsHash],
        value: mintingFee || parseEther('0.000001'), // Use contract fee or fallback
        gas: gasLimit,
        nonce: nonce, // Explicitly set nonce
      });
      
      setStatusMessage('Transaction submitted! Waiting for confirmation...');
      setTransactionStatus('confirming');
      
      console.log('Forge transaction sent:', result);
      return { hash: result, ipfsHash: metadataIpfsHash, metadata, imageIpfsHash };
      
    } catch (error: any) {
      console.error('Forging failed:', error);
      setTransactionStatus('error');
      
      // Parse common error messages
      let errorMessage = '';
      if (error?.message?.includes('INSUFFICIENT_FEE') || error?.message?.includes('Insufficient minting fee')) {
        const feeInEther = mintingFee ? (Number(mintingFee) / 1e18).toFixed(6) : '0.000001';
        errorMessage = `Insufficient AVAX sent (need ${feeInEther} AVAX)`;
      } else if (error?.message?.includes('LEVEL_TOO_LOW') || error?.message?.includes('Player level too low')) {
        errorMessage = 'Your level is too low for this weapon tier';
      } else if (error?.message?.includes('INVALID_TIER') || error?.message?.includes('Invalid weapon tier')) {
        errorMessage = 'Invalid weapon tier selected';
      } else if (error?.message?.includes('USER_REJECTED') || error?.message?.includes('rejected')) {
        errorMessage = 'Transaction was rejected by user';
      } else if (error?.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient AVAX balance';
      } else if (error?.message?.includes('nonce')) {
        errorMessage = 'Transaction nonce conflict. Please try again in a few seconds.';
      } else if (error?.message?.includes('replacement')) {
        errorMessage = 'Transaction was replaced. This usually means it was submitted too quickly.';
      } else if (error?.message?.includes('already in progress')) {
        errorMessage = error.message;
      } else {
        errorMessage = error?.shortMessage || error?.message || 'Forging failed';
      }
      
      setStatusMessage(`Error: ${errorMessage}`);
      throw new Error(errorMessage);
    } finally {
      // Always cleanup processing state
      setIsProcessing(false);
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
    forgeWeapon,
    isPending: isWritePending,
    isConfirming,
    isSuccess,
    hash,
    error: writeError || receiptError,
    mintingFee,
    gasEstimate,
    isProcessing,
    transactionStatus,
    statusMessage,
  };
}