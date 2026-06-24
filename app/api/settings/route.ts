import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const defaultSettings = {
  projectName: 'VibeDesk',
  location: 'Jakarta, Indonesia',
  companyName: 'FitrahPro',
  email: 'support@fitrahpro.com',
  phone: '081289886013',
  budgetAlertThreshold: 85,
  delayAlertDays: 5,
  notificationsEnabled: true,
  emailNotifications: true,
};

export async function GET(request: NextRequest) {
  try {
    let settings = await prisma.systemSettings.findUnique({
      where: { id: 'default-settings' },
    });

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          id: 'default-settings',
          ...defaultSettings,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
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
    
    // Filter body keys to only update valid schema fields
    const updateData: any = {};
    if (body.projectName !== undefined) updateData.projectName = body.projectName;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.companyName !== undefined) updateData.companyName = body.companyName;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.budgetAlertThreshold !== undefined) updateData.budgetAlertThreshold = Number(body.budgetAlertThreshold);
    if (body.delayAlertDays !== undefined) updateData.delayAlertDays = Number(body.delayAlertDays);
    if (body.notificationsEnabled !== undefined) updateData.notificationsEnabled = Boolean(body.notificationsEnabled);
    if (body.emailNotifications !== undefined) updateData.emailNotifications = Boolean(body.emailNotifications);

    const updatedSettings = await prisma.systemSettings.upsert({
      where: { id: 'default-settings' },
      update: updateData,
      create: {
        id: 'default-settings',
        projectName: body.projectName || defaultSettings.projectName,
        location: body.location || defaultSettings.location,
        companyName: body.companyName || defaultSettings.companyName,
        email: body.email || defaultSettings.email,
        phone: body.phone || defaultSettings.phone,
        budgetAlertThreshold: Number(body.budgetAlertThreshold || defaultSettings.budgetAlertThreshold),
        delayAlertDays: Number(body.delayAlertDays || defaultSettings.delayAlertDays),
        notificationsEnabled: body.notificationsEnabled !== undefined ? Boolean(body.notificationsEnabled) : defaultSettings.notificationsEnabled,
        emailNotifications: body.emailNotifications !== undefined ? Boolean(body.emailNotifications) : defaultSettings.emailNotifications,
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedSettings,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
