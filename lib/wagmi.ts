import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { avalanche, avalancheFuji } from 'wagmi/chains';
import { http } from 'wagmi';

export const wagmiConfig = getDefaultConfig({
  appName: 'Blacksmith Forge Game',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: [avalanche, avalancheFuji],
  transports: {
    [avalanche.id]: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      ? http(`https://avax-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`)
      : http(),
    [avalancheFuji.id]: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      ? http(`https://avax-fuji.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`)
      : http(),
  },
});

export const chains = [avalanche, avalancheFuji] as const;