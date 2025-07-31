import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Blacksmith Forge - NFT Weapon Crafting Game',
  description: 'Forge legendary weapons as NFTs on Avalanche C-Chain',
  keywords: ['NFT', 'Game', 'Blacksmith', 'Avalanche', 'Web3', 'Blockchain'],
  authors: [{ name: 'Blacksmith Forge Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#f59e0b',
  openGraph: {
    title: 'Blacksmith Forge',
    description: 'Craft legendary weapons as NFTs',
    type: 'website',
    images: ['/og-image.png']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}