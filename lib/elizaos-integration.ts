// ElizaOS + DEGA AI MCP Integration
import { ElizaRuntime, Character, ModelProvider } from '@elizaos/core'
import { NodePlugin } from '@elizaos/plugin-node'
import { MCPClient } from '@microsoft/mcp-sdk'
import type { AgentType } from '@/types'

export class ElizaOSIntegration {
  private runtime: ElizaRuntime
  private mcpClient: MCPClient
  private agentCharacters: Map<string, Character> = new Map()
  private voiceRecognition: any

  constructor() {
    this.initializeElizaOS()
    this.initializeMCP()
    this.initializeVoiceSupport()
  }

  private async initializeElizaOS() {
    console.log('[ElizaOS] Initializing autonomous agent framework...')
    
    // Initialize ElizaOS runtime
    this.runtime = new ElizaRuntime({
      token: process.env.OPENAI_API_KEY || '',
      modelProvider: ModelProvider.OPENAI,
      plugins: [new NodePlugin()],
    })

    // Create specialized agent characters
    await this.createAgentCharacters()
  }

  private async initializeMCP() {
    console.log('[MCP] Initializing Model Context Protocol...')
    
    this.mcpClient = new MCPClient({
      serverUrl: process.env.MCP_SERVER_URL || 'ws://localhost:8080',
      capabilities: [
        'autonomous_reasoning',
        'cross_agent_communication',
        'context_sharing',
        'decision_coordination'
      ]
    })

    await this.mcpClient.connect()
  }

  private async initializeVoiceSupport() {
    console.log('[Voice] Initializing voice query support...')
    
    // Initialize Web Speech API for voice queries
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      this.voiceRecognition = new SpeechRecognition()
      
      this.voiceRecognition.continuous = true
      this.voiceRecognition.interimResults = true
      this.voiceRecognition.lang = 'en-US'
      
      this.voiceRecognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript
        if (event.results[event.results.length - 1].isFinal) {
          this.processVoiceQuery(transcript)
        }
      }
    }
  }

  private async createAgentCharacters() {
    const characters = [
      {
        id: 'trader-agent',
        name: 'Aria',
        type: 'trader' as AgentType,
        bio: 'Expert DeFi trader specializing in cross-chain yield optimization and portfolio management',
        personality: 'Analytical, risk-aware, profit-focused',
        knowledge: ['DeFi protocols', 'yield farming', 'cross-chain bridges', 'portfolio theory'],
        goals: ['maximize returns', 'minimize risk', 'optimize gas costs', 'maintain liquidity']
      },
      {
        id: 'compliance-agent',
        name: 'Lex',
        type: 'compliance' as AgentType,
        bio: 'Regulatory compliance specialist with expertise in MiCA, SEC, and global crypto regulations',
        personality: 'Cautious, thorough, detail-oriented',
        knowledge: ['MiCA regulations', 'SEC guidelines', 'KYC/AML', 'tax compliance'],
        goals: ['ensure compliance', 'minimize regulatory risk', 'maintain transparency', 'protect users']
      },
      {
        id: 'supervisor-agent',
        name: 'Sage',
        type: 'supervisor' as AgentType,
        bio: 'AI ethics and bias detection specialist overseeing agent behavior and decision quality',
        personality: 'Impartial, ethical, systematic',
        knowledge: ['AI ethics', 'bias detection', 'model auditing', 'fairness metrics'],
        goals: ['prevent bias', 'ensure fairness', 'maintain quality', 'protect integrity']
      },
      {
        id: 'advisor-agent',
        name: 'Oracle',
        type: 'advisor' as AgentType,
        bio: 'Risk assessment and market prediction specialist using advanced ML models',
        personality: 'Predictive, data-driven, forward-thinking',
        knowledge: ['risk modeling', 'market analysis', 'predictive analytics', 'volatility forecasting'],
        goals: ['predict risks', 'forecast trends', 'provide insights', 'prevent losses']
      }
    ]

    for (const char of characters) {
      const character: Character = {
        id: char.id,
        name: char.name,
        bio: char.bio,
        lore: [`Specialized ${char.type} agent in the SentinelAI 4.0 ecosystem`],
        messageExamples: this.generateMessageExamples(char.type),
        postExamples: [],
        topics: char.knowledge,
        style: {
          all: [char.personality],
          chat: ['professional', 'informative', 'actionable'],
          post: ['analytical', 'data-driven', 'insightful']
        },
        adjectives: char.personality.split(', ')
      }

      this.agentCharacters.set(char.id, character)
      
      // Register character with ElizaOS runtime
      await this.runtime.registerCharacter(character)
    }
  }

  private generateMessageExamples(agentType: AgentType): Array<Array<{ user: string; content: { text: string } }>> {
    const examples = {
      trader: [
        [
          { user: 'user', content: { text: 'What should we do with the treasury allocation?' } },
          { user: 'trader-agent', content: { text: 'Based on current market volatility at 18%, I recommend rebalancing to 55% ETH, 25% stables, 20% DeFi tokens. This reduces risk by 12% while maintaining 8.5% expected APY. ZK-proof verification confirms optimal Sharpe ratio of 1.85.' } }
        ]
      ],
      compliance: [
        [
          { user: 'user', content: { text: 'Is this transaction compliant with MiCA?' } },
          { user: 'compliance-agent', content: { text: 'Transaction passes MiCA compliance checks: KYC level 3 verified, amount within €10k daily limit, jurisdiction whitelisted. Risk score: 0.15 (low). ZK-proof generated for regulatory audit trail.' } }
        ]
      ],
      supervisor: [
        [
          { user: 'user', content: { text: 'Check the trader agent for bias' } },
          { user: 'supervisor-agent', content: { text: 'Bias audit complete: No confirmation bias detected. Decision diversity score: 0.87 (good). Recommending continued operation with standard monitoring. Performance score maintained at 94%.' } }
        ]
      ],
      advisor: [
        [
          { user: 'user', content: { text: 'What are the market risks for next 24h?' } },
          { user: 'advisor-agent', content: { text: 'Edge AI prediction (847ms): 23% volatility spike probability, correlation with traditional markets at 0.65. Recommend defensive positioning. VaR at 95% confidence: -$45k. Suggested stop-loss at 8% drawdown.' } }
        ]
      ]
    }

    return examples[agentType] || []
  }

  async processVoiceQuery(transcript: string): Promise<string> {
    console.log(`[Voice] Processing query: "${transcript}"`)
    
    // Determine which agent should handle the query
    const agentId = this.determineResponsibleAgent(transcript)
    const character = this.agentCharacters.get(agentId)
    
    if (!character) {
      return "I couldn't determine which agent should handle this query."
    }

    // Process through ElizaOS
    const response = await this.runtime.processMessage({
      userId: 'voice-user',
      content: { text: transcript },
      agentId: character.id
    })

    // Share context via MCP
    await this.mcpClient.shareContext({
      agentId: character.id,
      query: transcript,
      response: response.text,
      timestamp: new Date(),
      confidence: 0.9
    })

    return response.text
  }

  private determineResponsibleAgent(query: string): string {
    const keywords = {
      'trader-agent': ['trade', 'portfolio', 'yield', 'allocation', 'rebalance', 'profit', 'APY'],
      'compliance-agent': ['compliance', 'regulation', 'legal', 'MiCA', 'SEC', 'KYC', 'AML'],
      'supervisor-agent': ['bias', 'audit', 'performance', 'quality', 'ethics', 'fairness'],
      'advisor-agent': ['risk', 'prediction', 'forecast', 'volatility', 'market', 'analysis']
    }

    const queryLower = query.toLowerCase()
    let bestMatch = 'advisor-agent' // default
    let maxScore = 0

    for (const [agentId, agentKeywords] of Object.entries(keywords)) {
      const score = agentKeywords.reduce((acc, keyword) => {
        return acc + (queryLower.includes(keyword) ? 1 : 0)
      }, 0)

      if (score > maxScore) {
        maxScore = score
        bestMatch = agentId
      }
    }

    return bestMatch
  }

  async enableAutonomousConversations(): Promise<void> {
    console.log('[ElizaOS] Enabling autonomous agent conversations...')
    
    // Set up inter-agent communication
    const agents = Array.from(this.agentCharacters.keys())
    
    for (const agentId of agents) {
      this.runtime.on(`message:${agentId}`, async (message) => {
        // Share with other relevant agents via MCP
        const relevantAgents = this.getRelevantAgents(agentId, message.content.text)
        
        for (const targetAgent of relevantAgents) {
          await this.mcpClient.sendMessage({
            from: agentId,
            to: targetAgent,
            content: message.content.text,
            type: 'autonomous_communication'
          })
        }
      })
    }
  }

  private getRelevantAgents(sourceAgent: string, message: string): string[] {
    // Logic to determine which agents should receive the message
    const relevanceMap = {
      'trader-agent': ['compliance-agent', 'advisor-agent'],
      'compliance-agent': ['supervisor-agent'],
      'supervisor-agent': ['trader-agent', 'compliance-agent', 'advisor-agent'],
      'advisor-agent': ['trader-agent', 'supervisor-agent']
    }

    return relevanceMap[sourceAgent as keyof typeof relevanceMap] || []
  }

  startVoiceRecognition(): void {
    if (this.voiceRecognition) {
      this.voiceRecognition.start()
      console.log('[Voice] Voice recognition started')
    }
  }

  stopVoiceRecognition(): void {
    if (this.voiceRecognition) {
      this.voiceRecognition.stop()
      console.log('[Voice] Voice recognition stopped')
    }
  }

  async getAgentResponse(agentId: string, query: string): Promise<string> {
    const character = this.agentCharacters.get(agentId)
    if (!character) {
      throw new Error(`Agent ${agentId} not found`)
    }

    const response = await this.runtime.processMessage({
      userId: 'system',
      content: { text: query },
      agentId: character.id
    })

    return response.text
  }

  getAvailableAgents(): Array<{ id: string; name: string; type: AgentType }> {
    return Array.from(this.agentCharacters.entries()).map(([id, character]) => ({
      id,
      name: character.name,
      type: id.split('-')[0] as AgentType
    }))
  }
}

export const elizaOSIntegration = new ElizaOSIntegration()
