import { NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/auth';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

export async function PUT(request) {
  try {
    const auth = await requireSuperAdmin(request);
    if (auth.error) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { userIds, newStatus } = await request.json();
    
    if (!userIds || userIds.length === 0) {
      return NextResponse.json({ success: false, error: 'No users selected' }, { status: 400 });
    }
    
    // Forward request to FastAPI backend
    const response = await fetch(`${BACKEND_URL}/admin/users/update-status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
      body: JSON.stringify({ userIds, newStatus }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ success: false, error: error.detail || 'Backend error' }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API Proxy Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}