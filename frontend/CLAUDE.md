# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
```bash
# Install dependencies
npm install

# Run development server with TurboPack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

### Environment Setup
The application requires a `.env.local` file with:
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` - WalletConnect project ID for wallet connections
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - Deployed Blacksmith NFT contract address on Avalanche
- `NEXT_PUBLIC_ALCHEMY_API_KEY` - Optional, for better RPC performance
- `PINATA_JWT`, `PINATA_API_KEY`, `PINATA_SECRET_API_KEY` - Pinata credentials for IPFS uploads

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.4.5 with App Router and TurboPack
- **Blockchain**: Avalanche C-Chain (mainnet) and Fuji (testnet)
- **Web3 Integration**: 
  - wagmi v2 for blockchain interactions
  - RainbowKit v2 for wallet connections
  - viem v2 for Ethereum/Avalanche utilities
- **Styling**: Tailwind CSS v4 with dark theme
- **State Management**: React Context API (GameContext)
- **Animations**: Framer Motion v12

### Project Structure

```
/app                      # Next.js App Router pages
  /api                   # API routes for IPFS uploads
    /upload-image        # Image upload to Pinata IPFS
    /upload-metadata     # Metadata upload to Pinata IPFS
    /weapon/[tokenId]    # Fetch weapon data by token ID
  /collection            # Collection page for viewing all weapons
  /profile              # User profile and stats page
  layout.tsx            # Root layout with providers
  page.tsx              # Main forge interface
  providers.tsx         # Client-side providers (wagmi, RainbowKit, GameContext)

/components              # React components
  ForgeInterface.tsx    # Main weapon forging UI
  Forge.tsx            # Visual forge animation component
  WeaponSelector.tsx   # Weapon type and tier selection
  Inventory.tsx        # Player's weapon inventory
  PlayerStats.tsx      # Player level and experience display
  CollectionGrid.tsx   # Grid display of NFT weapons
  WeaponCard.tsx       # Individual weapon card display

/contexts
  GameContext.tsx      # Global game state management

/hooks
  useBlacksmith.tsx    # Core hook for forging weapons and contract interactions
  useWeaponData.ts     # Hook for fetching weapon metadata from IPFS

/lib
  contracts.ts         # Smart contract address and ABI
  wagmi.ts            # wagmi configuration for Avalanche chains
  weapons.ts          # Weapon definitions, stats, and tiers
  ipfs.ts             # IPFS utilities for metadata and image handling
  weaponImageGenerator.ts  # Dynamic weapon image generation
  errorHandling.ts    # Error utilities and handlers

/types
  game.ts             # TypeScript types for weapons, players, etc.
  collection.ts       # Types for collection filtering and sorting
```

### Key Architectural Patterns

1. **Smart Contract Integration**
   - The app interacts with a BlacksmithNFT contract deployed on Avalanche
   - Contract functions: `forgeWeapon`, `getPlayer`, `getPlayerWeapons`, `getWeapon`
   - Minting fee required for forging (configurable in contract)

2. **IPFS Storage Pattern**
   - Weapon images are generated dynamically and uploaded to IPFS via Pinata
   - Metadata follows OpenSea/ERC721 standards with attributes
   - Fallback gateways for IPFS content retrieval with automatic failover

3. **State Management Flow**
   - GameContext provides global game state (player data, weapons, selections)
   - useBlacksmith hook manages transaction lifecycle and error handling
   - Optimistic UI updates with blockchain confirmation

4. **Transaction Management**
   - Nonce management to prevent conflicts
   - Transaction cooldown (3 seconds) between operations
   - Gas estimation with 50% buffer for reliability
   - Comprehensive error handling with user-friendly messages

5. **Weapon System**
   - 3 weapon types: Sword, Bow, Axe
   - 10 tiers per weapon type (level-gated)
   - 5 rarity levels affecting stats
   - Stats: damage, durability, speed (randomized on-chain)

### Critical Dependencies

- **Avalanche RPC**: Application requires connection to Avalanche C-Chain
- **IPFS Gateway**: Pinata gateway for storing NFT metadata and images
- **WalletConnect**: Required for mobile wallet connections
- **Smart Contract**: Must be deployed and accessible at configured address

### Error Handling Strategy

The app implements comprehensive error handling:
- Contract errors are parsed and displayed with user-friendly messages
- IPFS failures have fallback mechanisms
- Transaction errors include retry guidance
- Network issues are handled gracefully with loading states

### Development Workflow

1. **Adding New Features**: Check existing patterns in `/components` and `/hooks`
2. **Modifying Contract Interactions**: Update `/lib/contracts.ts` ABI and `/hooks/useBlacksmith.tsx`
3. **Styling Changes**: Use existing Tailwind classes, maintain dark theme consistency
4. **State Updates**: Use GameContext dispatch actions for global state changes
5. **Error Scenarios**: Add error cases to `/lib/errorHandling.ts` and handle in components

### Testing Approach

While no test framework is currently configured, when testing:
- Test wallet connections on both desktop and mobile
- Verify IPFS uploads and metadata retrieval
- Test transaction flows with insufficient funds
- Verify level-gating for weapon tiers
- Test collection filtering and sorting