import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

// Define the file path for system settings persistence
const SETTINGS_FILE = path.join(process.cwd(), 'settings.json');

const defaultSettings = {
  projectName: 'FitrahPro',
  location: 'Jakarta, Indonesia',
  companyName: 'FitrahPro',
  email: 'support@fitrahpro.com',
  phone: '+62 (21) 567-8900',
  budgetAlertThreshold: 85,
  delayAlertDays: 5,
  notificationsEnabled: true,
  emailNotifications: true,
};

// Read settings from JSON
function readSettings(): typeof defaultSettings {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), 'utf-8');
      return defaultSettings;
    }
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to read settings file, using defaults', error);
    return defaultSettings;
  }
}

// Write settings to JSON
function writeSettings(data: any): void {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write settings file', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const data = readSettings();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
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
    const currentData = readSettings();
    
    // Update settings
    const updatedData = {
      ...currentData,
      ...body,
    };

    writeSettings(updatedData);

    return NextResponse.json({
      success: true,
      data: updatedData,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
