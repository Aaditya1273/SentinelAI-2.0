import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

// Create new session
export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();
    
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const db = getDatabase();
    const { user, sessionId } = db.createUser(address);
    
    // Initialize default data for the new session
    db.initializeDefaultData(sessionId);

    return NextResponse.json({
      success: true,
      sessionId,
      user
    });
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

// Get session data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const db = getDatabase();
    const user = db.getUser(sessionId);

    if (!user) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Update last active time
    db.updateUserActivity(sessionId);

    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 });
  }
}

// Disconnect session
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const db = getDatabase();
    db.disconnectUser(sessionId);

    return NextResponse.json({
      success: true,
      message: 'Session disconnected'
    });
  } catch (error) {
    console.error('Session disconnect error:', error);
    return NextResponse.json({ error: 'Failed to disconnect session' }, { status: 500 });
  }
}
