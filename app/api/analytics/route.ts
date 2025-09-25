import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

// Get analytics for session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const db = getDatabase();
    const analytics = db.getAnalytics(sessionId);

    if (!analytics) {
      return NextResponse.json({ error: 'Analytics data not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Analytics retrieval error:', error);
    return NextResponse.json({ error: 'Failed to retrieve analytics' }, { status: 500 });
  }
}

// Save analytics for session
export async function POST(request: NextRequest) {
  try {
    const { sessionId, analytics } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const db = getDatabase();
    
    const analyticsData = {
      portfolio_return: analytics.portfolioReturn,
      risk_score: analytics.riskScore,
      efficiency: analytics.efficiency,
      sharpe_ratio: analytics.sharpeRatio,
      max_drawdown: analytics.maxDrawdown,
      volatility: analytics.volatility,
      total_value: analytics.totalValue,
      daily_change: analytics.dailyChange,
      weekly_change: analytics.weeklyChange,
      monthly_change: analytics.monthlyChange
    };

    db.saveAnalytics(sessionId, analyticsData);

    return NextResponse.json({
      success: true,
      message: 'Analytics saved'
    });
  } catch (error) {
    console.error('Analytics save error:', error);
    return NextResponse.json({ error: 'Failed to save analytics' }, { status: 500 });
  }
}
