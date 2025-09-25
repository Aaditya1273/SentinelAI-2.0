import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

// Get treasury data for session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const db = getDatabase();
    const treasuryData = db.getTreasuryData(sessionId);

    if (!treasuryData) {
      return NextResponse.json({ error: 'Treasury data not found' }, { status: 404 });
    }

    // Parse JSON fields
    const parsed = {
      ...treasuryData,
      tokens: JSON.parse(treasuryData.tokens),
      defiPositions: JSON.parse(treasuryData.defi_positions)
    };

    return NextResponse.json({
      success: true,
      data: parsed
    });
  } catch (error) {
    console.error('Treasury data retrieval error:', error);
    return NextResponse.json({ error: 'Failed to retrieve treasury data' }, { status: 500 });
  }
}

// Save treasury data for session
export async function POST(request: NextRequest) {
  try {
    const { sessionId, treasuryData } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const db = getDatabase();
    
    // Prepare data for storage
    const dataToSave = {
      total_value: treasuryData.totalValue,
      eth_price: treasuryData.ethPrice,
      btc_price: treasuryData.btcPrice,
      tokens: JSON.stringify(treasuryData.tokens),
      defi_positions: JSON.stringify(treasuryData.defiPositions)
    };

    db.saveTreasuryData(sessionId, dataToSave);

    return NextResponse.json({
      success: true,
      message: 'Treasury data saved'
    });
  } catch (error) {
    console.error('Treasury data save error:', error);
    return NextResponse.json({ error: 'Failed to save treasury data' }, { status: 500 });
  }
}
