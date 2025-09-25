import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

// Get decisions for session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const db = getDatabase();
    const decisions = db.getDecisions(sessionId, limit);

    return NextResponse.json({
      success: true,
      data: decisions
    });
  } catch (error) {
    console.error('Decisions retrieval error:', error);
    return NextResponse.json({ error: 'Failed to retrieve decisions' }, { status: 500 });
  }
}

// Save decision for session
export async function POST(request: NextRequest) {
  try {
    const { sessionId, decision } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const db = getDatabase();
    
    const decisionData = {
      agent_id: decision.agentId || 'system',
      timestamp: decision.timestamp || new Date().toISOString(),
      type: decision.type,
      action: decision.action,
      confidence: decision.confidence,
      impact: decision.impact
    };

    db.saveDecision(sessionId, decisionData);

    return NextResponse.json({
      success: true,
      message: 'Decision saved'
    });
  } catch (error) {
    console.error('Decision save error:', error);
    return NextResponse.json({ error: 'Failed to save decision' }, { status: 500 });
  }
}
