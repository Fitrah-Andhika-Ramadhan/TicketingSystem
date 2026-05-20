import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Mock media database
let mockMedia = [
  {
    id: '1',
    type: 'image',
    title: 'Metro Paragon Main Tower',
    description: 'Stunning luxury residential tower with premium amenities',
    url: '/hero-metro-paragon.jpg',
    thumbnail: '/hero-metro-paragon.jpg',
    position: 1,
    featured: true,
    uploadedAt: new Date(),
  },
  {
    id: '2',
    type: 'image',
    title: 'Construction Progress Phase 2',
    description: 'Real-time construction progress with advanced safety measures',
    url: '/construction-progress.jpg',
    thumbnail: '/construction-progress.jpg',
    position: 2,
    featured: false,
    uploadedAt: new Date(),
  },
  {
    id: '3',
    type: 'image',
    title: 'Premium Interior Design',
    description: 'Modern luxury apartment interiors with premium finishes',
    url: '/interior-design.jpg',
    thumbnail: '/interior-design.jpg',
    position: 3,
    featured: false,
    uploadedAt: new Date(),
  },
  {
    id: '4',
    type: 'image',
    title: 'World-Class Amenities',
    description: 'Rooftop swimming pool with stunning city views',
    url: '/amenities-pool.jpg',
    thumbnail: '/amenities-pool.jpg',
    position: 4,
    featured: true,
    uploadedAt: new Date(),
  },
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: mockMedia.sort((a, b) => a.position - b.position),
    });
  } catch (error) {
    console.error('Get media error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, title, description, url, thumbnail, featured } = body;

    if (!type || !title || !url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newMedia = {
      id: String(Date.now()),
      type,
      title,
      description: description || '',
      url,
      thumbnail: thumbnail || url,
      position: mockMedia.length + 1,
      featured: featured || false,
      uploadedAt: new Date(),
    };

    mockMedia.push(newMedia);

    return NextResponse.json(
      { success: true, data: newMedia },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create media error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Media ID is required' },
        { status: 400 }
      );
    }

    const mediaIndex = mockMedia.findIndex(m => m.id === id);

    if (mediaIndex === -1) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    mockMedia[mediaIndex] = {
      ...mockMedia[mediaIndex],
      ...updateData,
    };

    return NextResponse.json({
      success: true,
      data: mockMedia[mediaIndex],
    });
  } catch (error) {
    console.error('Update media error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Media ID is required' },
        { status: 400 }
      );
    }

    const mediaIndex = mockMedia.findIndex(m => m.id === id);

    if (mediaIndex === -1) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    const deletedMedia = mockMedia.splice(mediaIndex, 1)[0];

    // Re-order positions
    mockMedia = mockMedia.map((m, idx) => ({
      ...m,
      position: idx + 1,
    }));

    return NextResponse.json({
      success: true,
      data: deletedMedia,
    });
  } catch (error) {
    console.error('Delete media error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
