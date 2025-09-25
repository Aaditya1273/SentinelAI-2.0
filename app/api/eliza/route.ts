// Real ElizaOS API Routes for SentinelAI 4.0 Hackathon
import { NextRequest, NextResponse } from 'next/server'
import { realElizaOSIntegration } from '@/lib/elizaos-real-integration'

// POST /api/eliza - Query ElizaOS agents
export async function POST(request: NextRequest) {
  try {
    const { agentId, query, type } = await request.json()

    console.log(`[API] ElizaOS query - Agent: ${agentId}, Query: ${query}`)

    if (type === 'voice') {
      // Process voice query
      const response = await realElizaOSIntegration.processVoiceQuery(query)
      
      return NextResponse.json({
        success: true,
        response,
        type: 'voice',
        timestamp: Date.now()
      })
    } else {
      // Process agent query
      const result = await realElizaOSIntegration.queryAgent(agentId, query)
      
      return NextResponse.json({
        success: true,
        ...result,
        timestamp: Date.now()
      })
    }
  } catch (error) {
    console.error('[API] ElizaOS query failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    }, { status: 500 })
  }
}

// GET /api/eliza - Get ElizaOS status and available agents
export async function GET() {
  try {
    const status = realElizaOSIntegration.getStatus()
    const agents = realElizaOSIntegration.getAvailableAgents()

    return NextResponse.json({
      success: true,
      status,
      agents,
      hackathonDemo: true,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('[API] ElizaOS status failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    }, { status: 500 })
  }
}
