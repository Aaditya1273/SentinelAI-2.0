import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

// Get agents for session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const db = getDatabase();
    const agents = db.getAgents(sessionId);

    return NextResponse.json({
      success: true,
      data: agents
    });
  } catch (error) {
    console.error('Agents retrieval error:', error);
    return NextResponse.json({ error: 'Failed to retrieve agents' }, { status: 500 });
  }
}

// Save/Update agent for session
export async function POST(request: NextRequest) {
  try {
    const { sessionId, agent } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const db = getDatabase();
    
    const agentData = {
      agent_id: agent.id,
      name: agent.name,
      status: agent.status,
      performance: agent.performance,
      last_action: agent.lastAction,
      decisions: agent.decisions,
      uptime: agent.uptime
    };

    db.saveAgent(sessionId, agentData);

    return NextResponse.json({
      success: true,
      message: 'Agent saved'
    });
  } catch (error) {
    console.error('Agent save error:', error);
    return NextResponse.json({ error: 'Failed to save agent' }, { status: 500 });
  }
}
