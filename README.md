# Blacksmith Game
A decentralized NFT crafting game where players forge unique weapons on the blockchain, level up their smithing skills, and collect rare weapons as ERC721 tokens.

## What is Blacksmith Game?
Blacksmith Game is an on-chain progression system where players act as blacksmiths, forging weapons of increasing power and rarity. Each weapon is a unique NFT stored with metadata on IPFS, featuring procedurally generated stats based on tier and luck. Players gain experience with each forge, unlocking higher tiers and more powerful creations.

## Key Features

### 🗡️ Multiple Weapon Types
- **Swords**: Balanced weapons for close combat
- **Bows**: Ranged weapons with high speed
- **Axes**: Heavy weapons with devastating damage
- Each weapon type has 10 tiers of progression

### ⚡ Progression System
- **Player Leveling**: Gain 1000 XP per weapon forged
- **Tier Unlocking**: Higher tiers require higher player levels
  - Tier 1: Level 1
  - Tier 2: Level 11
  - Tier 3: Level 21
  - ...up to Tier 10: Level 91
- **Max Level**: 100

### 🎲 Dynamic Weapon Generation
- Stats vary based on tier and randomness (±20% variation)
- **Damage**: Increases with tier (30-120 base range)
- **Durability**: Weapon longevity (58-130 base range)
- **Speed**: Attack/draw speed (35-80 base range)

### 💎 Rarity System
Weapons can roll different rarities based on tier:
- **Common**: Base tier weapons
- **Uncommon**: Tier 3+ (60% chance)
- **Rare**: Tier 5+ (35% chance)
- **Epic**: Tier 7+ (15% chance)
- **Legendary**: Tier 9+ (5% chance)

### 🖼️ IPFS NFT Metadata
All weapon metadata is stored on IPFS for decentralized, permanent storage:
- Weapon images
- Trait metadata (type, tier, rarity, stats)
- Crafting history (timestamp, creator)

### 💰 Simple Economics
- Minimal minting fee: 0.000001 ETH per forge
- Owner can withdraw accumulated fees
- Optimized gas costs for crafting

## How It Works

1. **Connect Wallet**: Connect your Web3 wallet to the game
2. **Auto-Registration**: Players are automatically registered on first forge
3. **Choose Weapon**: Select weapon type (Sword/Bow/Axe) and tier
4. **Upload to IPFS**: Generate or upload weapon metadata to IPFS
5. **Forge Weapon**: Pay minimal fee and mint your unique NFT
6. **Level Up**: Gain XP and unlock higher tier weapons
7. **Collect & Trade**: View your arsenal and trade on NFT marketplaces

## Project Structure

```
blacksmithgame/
├── contracts/         # Smart contracts (Solidity + Foundry)
│   ├── src/
│   │   └── BlacksmithNFT.sol
│   ├── test/
│   └── script/
└── frontend/          # Web interface (Next.js + TypeScript)
    ├── app/
    ├── components/
    └── lib/
```

## Deployed Contracts

### Core Contracts
- **BlacksmithNFT**: `[To be deployed]`
  - ERC721 token for forged weapons
  - Stores weapon stats and player progression
  - IPFS integration for metadata

### Token Standards
- **ERC721**: Weapon NFTs with full metadata
- **ERC721URIStorage**: IPFS-based token URIs
- **OpenZeppelin**: Audited, secure implementations

## Getting Started

Each component has its own setup:

### Contracts Setup

```bash
cd contracts

# Install dependencies
forge install

# Build contracts
forge build

# Run tests
forge test

# Deploy to network
forge script script/Deploy.s.sol --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> --broadcast
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your contract address and RPC URL

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play the game.

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=43113  # Avalanche Fuji testnet
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

## Technology Stack

- **Smart Contracts**: Solidity 0.8.19, OpenZeppelin, Foundry
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Wagmi, Viem
- **Blockchain**: Avalanche (or any EVM-compatible chain)
- **Storage**: IPFS for NFT metadata
- **Web3**: Reown AppKit for wallet connections

## Game Mechanics

### Weapon Stats Calculation

```
Base Stats by Tier:
- Damage = tier × 10 + 20
- Durability = tier × 8 + 50
- Speed = tier × 5 + 30

Random Variation: ±20% on all stats
```

### Experience & Leveling

```
XP per forge: 1,000 XP
XP per level: 1,200 XP
Level formula: (Total XP / 1,200) + 1
```

### Tier Requirements

```
Required Level = (Tier - 1) × 10 + 1

Example:
- Tier 1: Level 1+
- Tier 5: Level 41+
- Tier 10: Level 91+
```

## Smart Contract Features

### Player Tracking
- Level and experience points
- Weapon crafting statistics (swords/bows/axes)
- Complete weapon collection per player

### Gas Optimization
- Auto-registration on first forge (no separate transaction)
- Efficient storage with packed structs
- ReentrancyGuard for security

### Admin Functions
- Withdraw accumulated fees
- Update minting fee (if needed)
- Owner-only controls

## Development Roadmap

- [ ] Deploy to Avalanche Fuji testnet
- [ ] Add weapon upgrade/repair mechanics
- [ ] Implement weapon trading marketplace
- [ ] Add weapon burning for resources
- [ ] PvP combat system
- [ ] Guild/clan features
- [ ] Seasonal events and limited editions

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Live Demo

[Coming Soon - Deploy to production]

---

**Built with ⚒️ by blacksmiths, for blacksmiths**
