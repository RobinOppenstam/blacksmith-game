// src/app/api/upload-image/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const weaponInfo = JSON.parse(formData.get('weaponInfo') as string);

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large (max 10MB)' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create form data for Pinata
    const pinataFormData = new FormData();
    pinataFormData.append('file', new Blob([buffer], { type: file.type }), file.name);
    
    const pinataMetadata = JSON.stringify({
      name: `weapon-image-${weaponInfo.weaponType}-tier${weaponInfo.tier}-${weaponInfo.rarity}-${weaponInfo.tokenId}`,
      keyvalues: {
        weaponType: weaponInfo.weaponType,
        tier: weaponInfo.tier,
        rarity: weaponInfo.rarity,
        tokenId: weaponInfo.tokenId,
        category: 'weapon-image'
      }
    });
    
    pinataFormData.append('pinataMetadata', pinataMetadata);
    pinataFormData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

    // Upload to Pinata
    const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
      },
      body: pinataFormData,
    });

    if (!pinataResponse.ok) {
      const errorText = await pinataResponse.text();
      console.error('Pinata image upload error:', errorText);
      throw new Error(`Pinata upload failed: ${pinataResponse.status}`);
    }

    const pinataData = await pinataResponse.json();
    
    return NextResponse.json({ 
      ipfsHash: pinataData.IpfsHash,
      pinSize: pinataData.PinSize,
      timestamp: pinataData.Timestamp
    });

  } catch (error: any) {
    console.error('Image upload failed:', error);
    
    // Fallback for development
    if (process.env.NODE_ENV === 'development') {
      const mockHash = `QmImageMock${Date.now()}${Math.random().toString(36).substring(7)}`;
      console.warn(`Using mock image IPFS hash for development: ${mockHash}`);
      return NextResponse.json({ ipfsHash: mockHash });
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}

