import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

// Define the file path for landing page content persistence
const CONTENT_FILE = path.join(process.cwd(), 'landing-content.json');

const defaultContent = {
  hero: {
    title: 'FitrahPro',
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
    projects: 50, // 50K+ Tiket Selesai
    units: 2, // 2 Menit Respon
    yearsExperience: 99, // 99.9% Uptime
    satisfaction: 500 // 500+ Mitra
  },
  about: {
    title: 'Tentang FitrahPro',
    description: 'Dengan pengalaman bertahun-tahun, FitrahPro menghadirkan solusi teknologi mutakhir untuk mempermudah operasional bisnis dan penanganan dukungan pelanggan di Indonesia.',
    mission: 'Menyediakan platform manajemen operasional & dukungan pelanggan yang mulus bagi seluruh pelaku industri digital.',
    vision: 'Menjadi standar ekosistem platform helpdesk & SLA monitoring terdepan di Asia Tenggara.'
  }
};

// Read from JSON file
function readContent(): typeof defaultContent {
  try {
    if (!fs.existsSync(CONTENT_FILE)) {
      fs.writeFileSync(CONTENT_FILE, JSON.stringify(defaultContent, null, 2), 'utf-8');
      return defaultContent;
    }
    const raw = fs.readFileSync(CONTENT_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to read landing content file, using defaults', error);
    return defaultContent;
  }
}

// Write to JSON file
function writeContent(data: any): void {
  try {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write landing content file', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const data = readContent();
    return NextResponse.json({
      success: true,
      data,
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
    const currentData = readContent();
    
    // Update content
    const updatedData = {
      ...currentData,
      ...body,
    };

    writeContent(updatedData);

    return NextResponse.json({
      success: true,
      data: updatedData,
    });
  } catch (error) {
    console.error('Update landing content error:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}
