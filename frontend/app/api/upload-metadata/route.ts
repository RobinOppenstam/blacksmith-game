// src/app/api/upload-metadata/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const metadata = await request.json();
    
    // Validate metadata structure
    if (!metadata.name || !metadata.description || !metadata.attributes) {
      return NextResponse.json(
        { error: 'Invalid metadata structure' },
        { status: 400 }
      );
    }

    // Upload to Pinata
    const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `weapon-metadata-${metadata.name.replace(/\s+/g, '-').toLowerCase()}`,
          keyvalues: {
            weaponType: metadata.attributes.find((attr: any) => attr.trait_type === 'Weapon Type')?.value || 'unknown',
            tier: metadata.attributes.find((attr: any) => attr.trait_type === 'Tier')?.value || 'unknown',
            rarity: metadata.attributes.find((attr: any) => attr.trait_type === 'Rarity')?.value || 'unknown'
          }
        },
        pinataOptions: {
          cidVersion: 1
        }
      }),
    });

    if (!pinataResponse.ok) {
      const errorText = await pinataResponse.text();
      console.error('Pinata error:', errorText);
      throw new Error(`Pinata upload failed: ${pinataResponse.status}`);
    }

    const pinataData = await pinataResponse.json();
    
    return NextResponse.json({ 
      ipfsHash: pinataData.IpfsHash,
      pinSize: pinataData.PinSize,
      timestamp: pinataData.Timestamp
    });

  } catch (error: any) {
    console.error('Metadata upload failed:', error);
    
    // Fallback to mock hash for development
    if (process.env.NODE_ENV === 'development') {
      const mockHash = `QmMock${Date.now()}${Math.random().toString(36).substring(7)}`;
      console.warn(`Using mock IPFS hash for development: ${mockHash}`);
      return NextResponse.json({ ipfsHash: mockHash });
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to upload metadata' },
      { status: 500 }
    );
  }
}

