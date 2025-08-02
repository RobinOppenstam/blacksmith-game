import { Address } from 'viem';

export const BLACKSMITH_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;

// ABI for our smart contract functions
export const BLACKSMITH_ABI = [
  {
    "inputs": [
      {"internalType": "uint8", "name": "_weaponType", "type": "uint8"},
      {"internalType": "uint8", "name": "_tier", "type": "uint8"},
      {"internalType": "string", "name": "_ipfsHash", "type": "string"}
    ],
    "name": "forgeWeapon",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_player", "type": "address"}],
    "name": "getPlayer",
    "outputs": [
      {
        "components": [
          {"internalType": "uint16", "name": "level", "type": "uint16"},
          {"internalType": "uint32", "name": "experience", "type": "uint32"},
          {"internalType": "uint16", "name": "swordsCrafted", "type": "uint16"},
          {"internalType": "uint16", "name": "bowsCrafted", "type": "uint16"},
          {"internalType": "uint16", "name": "axesCrafted", "type": "uint16"},
          {"internalType": "bool", "name": "isRegistered", "type": "bool"}
        ],
        "internalType": "struct BlacksmithNFT.Player",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_player", "type": "address"}],
    "name": "getPlayerWeapons",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_tokenId", "type": "uint256"}],
    "name": "getWeapon",
    "outputs": [
      {
        "components": [
          {"internalType": "uint8", "name": "weaponType", "type": "uint8"},
          {"internalType": "uint8", "name": "tier", "type": "uint8"},
          {"internalType": "uint8", "name": "rarity", "type": "uint8"},
          {"internalType": "uint16", "name": "damage", "type": "uint16"},
          {"internalType": "uint16", "name": "durability", "type": "uint16"},
          {"internalType": "uint16", "name": "speed", "type": "uint16"},
          {"internalType": "uint32", "name": "craftedAt", "type": "uint32"},
          {"internalType": "address", "name": "craftedBy", "type": "address"},
          {"internalType": "string", "name": "ipfsHash", "type": "string"}
        ],
        "internalType": "struct BlacksmithNFT.Weapon",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_player", "type": "address"},
      {"internalType": "uint8", "name": "_tier", "type": "uint8"}
    ],
    "name": "canCraftTier",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_player", "type": "address"}],
    "name": "estimateForgeGas",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MINTING_FEE",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;