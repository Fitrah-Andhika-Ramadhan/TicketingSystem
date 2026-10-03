import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const careerToken = authHeader?.split(' ')[1];

    if (!careerToken) {
      return NextResponse.json({ success: false, error: 'No career API token provided' }, { status: 401 });
    }

    const response = await fetch('https://career-rc3id.id/public/api/v1/recent-activities', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${careerToken}`,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        success: false, 
        error: `Career API error: ${response.status}`,
        detail: errorText
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error('Career API proxy error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
