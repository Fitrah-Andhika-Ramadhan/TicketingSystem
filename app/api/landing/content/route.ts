import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Mock landing page content
let landingContent = {
  hero: {
    title: 'Nata Group - Metro Paragon Residence',
    subtitle: 'Premium Residential Development in the Heart of Jakarta',
    description: 'Experience luxury living with our state-of-the-art residential complex featuring world-class amenities and modern architecture.',
    ctaText: 'View Project',
    backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop'
  },
  features: [
    {
      title: 'Smart Design',
      description: 'Modern architecture with sustainable features',
      icon: '🏗️'
    },
    {
      title: 'Security First',
      description: '24/7 security with CCTV and trained personnel',
      icon: '🔒'
    },
    {
      title: 'World-class Amenities',
      description: 'Swimming pool, gym, spa, and recreation areas',
      icon: '⭐'
    },
    {
      title: 'Green Living',
      description: 'Parks and gardens with eco-friendly features',
      icon: '🌿'
    },
    {
      title: 'Prime Location',
      description: 'Easy access to business districts and schools',
      icon: '📍'
    },
    {
      title: 'Investment Value',
      description: 'High ROI with strong market demand',
      icon: '💰'
    }
  ],
  stats: {
    projects: 25,
    units: 500,
    yearsExperience: 10,
    satisfaction: 98
  },
  about: {
    title: 'About Nata Group',
    description: 'With over 10 years of experience, Nata Group has established itself as a leading real estate developer in Indonesia, delivering premium residential and commercial projects.',
    mission: 'To create exceptional living spaces that enhance quality of life',
    vision: 'To be the most trusted real estate developer in Southeast Asia'
  }
};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: landingContent,
    });
  } catch (error) {
    console.error('Get landing content error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
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
    
    // Update content
    landingContent = {
      ...landingContent,
      ...body,
    };

    return NextResponse.json({
      success: true,
      data: landingContent,
    });
  } catch (error) {
    console.error('Update landing content error:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}
