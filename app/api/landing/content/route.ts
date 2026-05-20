import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const defaultContent = {
  hero: {
    title: 'VibeDesk',
    subtitle: 'Sistem Manajemen Tiket & SLA Terbaik',
    description: 'Sistem penanganan tiket dan pemantauan Service Level Agreement (SLA) terbaik untuk bisnis digital Anda.',
    ctaText: 'Mulai Sekarang',
    backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop'
  },
  features: [
    {
      title: 'Smart Ticketing',
      description: 'Manajemen tiket otomatis berbasis kategori dan urgensi.',
      icon: '🎫'
    },
    {
      title: 'Real-time SLA',
      description: 'Pantau waktu respon dan resolusi tiket secara langsung.',
      icon: '⏱️'
    },
    {
      title: 'Kolaborasi Tim',
      description: 'Delegasikan tugas dan diskusikan solusi dalam tim.',
      icon: '👥'
    },
    {
      title: 'Analitik Mendalam',
      description: 'Laporan visual 90 hari untuk efisiensi performa agen.',
      icon: '📈'
    },
    {
      title: 'Keamanan Data',
      description: 'Keamanan data dan kontrol akses tingkat tinggi.',
      icon: '🔒'
    },
    {
      title: 'Skalabilitas Tinggi',
      description: 'Mendukung integrasi ribuan tiket per hari tanpa hambatan.',
      icon: '🚀'
    }
  ],
  stats: {
    projects: 50,
    units: 2,
    yearsExperience: 99,
    satisfaction: 500
  },
  about: {
    title: 'Tentang VibeDesk',
    description: 'Dengan pengalaman bertahun-tahun, VibeDesk menghadirkan solusi teknologi mutakhir untuk mempermudah operasional bisnis dan penanganan dukungan pelanggan di Indonesia.',
    mission: 'Menyediakan platform manajemen operasional & dukungan pelanggan yang mulus bagi seluruh pelaku industri digital.',
    vision: 'Menjadi standar ekosistem platform helpdesk & SLA monitoring terdepan di Asia Tenggara.'
  }
};

export async function GET(request: NextRequest) {
  try {
    let content = await prisma.landingContent.findUnique({
      where: { id: 'default-landing' },
    });

    if (!content) {
      content = await prisma.landingContent.create({
        data: {
          id: 'default-landing',
          hero: defaultContent.hero,
          features: defaultContent.features,
          stats: defaultContent.stats,
          about: defaultContent.about,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: content,
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
    
    const updateData: any = {};
    if (body.hero !== undefined) updateData.hero = body.hero;
    if (body.features !== undefined) updateData.features = body.features;
    if (body.stats !== undefined) updateData.stats = body.stats;
    if (body.about !== undefined) updateData.about = body.about;

    const updatedContent = await prisma.landingContent.upsert({
      where: { id: 'default-landing' },
      update: updateData,
      create: {
        id: 'default-landing',
        hero: body.hero || defaultContent.hero,
        features: body.features || defaultContent.features,
        stats: body.stats || defaultContent.stats,
        about: body.about || defaultContent.about,
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedContent,
    });
  } catch (error) {
    console.error('Update landing content error:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}
