// Agent Marketplace - Tokenized Agent Economy
import { ethers } from 'ethers'
import type { AgentType } from '@/types'
import { EventEmitter } from 'events'

interface AgentListing {
  id: string
  owner: string
  agentType: AgentType
  name: string
  description: string
  hourlyRate: number // in USDM tokens
  stakingRequirement: number
  performanceScore: number
  totalEarnings: number
  hiredCount: number
  isActive: boolean
  specialties: string[]
  availability: 'available' | 'busy' | 'offline'
  rating: number
  reviews: Review[]
}

interface Review {
  reviewer: string
  rating: number
  comment: string
  timestamp: Date
  verified: boolean
}

interface HiringContract {
  id: string
  agentId: string
  hirer: string
  duration: number // hours
  totalCost: number
  startTime: Date
  status: 'pending' | 'active' | 'completed' | 'disputed'
  deliverables: string[]
  milestones: Milestone[]
}

interface Milestone {
  description: string
  payment: number
  completed: boolean
  timestamp?: Date
}

export class AgentMarketplace extends EventEmitter {
  private listings: Map<string, AgentListing> = new Map()
  private contracts: Map<string, HiringContract> = new Map()
  private usdmContract: any
  private provider: ethers.Provider
  private signer: ethers.Signer

  constructor() {
    super()
    this.initializeMarketplace()
  }

  private async initializeMarketplace() {
    console.log('[Marketplace] Initializing tokenized agent economy...')
    
    // Initialize with demo agents
    await this.createDemoAgents()
    
    // Set up blockchain connection
    await this.initializeBlockchain()
    
    console.log('[Marketplace] Agent marketplace ready')
  }

  private async initializeBlockchain() {
    try {
      // In production, connect to actual blockchain
      // this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
      // this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider)
      
      // Mock blockchain connection for demo
      console.log('[Blockchain] Connected to USDM token contract')
    } catch (error) {
      console.error('[Blockchain] Failed to connect:', error)
    }
  }

  private async createDemoAgents() {
    const demoAgents: Omit<AgentListing, 'id'>[] = [
      {
        owner: '0x1234567890123456789012345678901234567890',
        agentType: 'trader',
        name: 'Aria - Elite DeFi Trader',
        description: 'Advanced portfolio optimization with 89% success rate. Specializes in cross-chain yield farming and risk-adjusted returns.',
        hourlyRate: 50, // 50 USDM per hour
        stakingRequirement: 5000,
        performanceScore: 94,
        totalEarnings: 125000,
        hiredCount: 247,
        isActive: true,
        specialties: ['Portfolio Optimization', 'Yield Farming', 'Cross-chain Trading', 'Risk Management'],
        availability: 'available',
        rating: 4.8,
        reviews: [
          {
            reviewer: '0xabcd...',
            rating: 5,
            comment: 'Increased our treasury yield by 23% in just 2 weeks. Excellent risk management.',
            timestamp: new Date('2024-01-15'),
            verified: true
          }
        ]
      },
      {
        owner: '0x2345678901234567890123456789012345678901',
        agentType: 'compliance',
        name: 'Lex - Regulatory Expert',
        description: 'MiCA and SEC compliance specialist with 96% accuracy. Ensures full regulatory compliance across jurisdictions.',
        hourlyRate: 75,
        stakingRequirement: 7500,
        performanceScore: 98,
        totalEarnings: 89000,
        hiredCount: 156,
        isActive: true,
        specialties: ['MiCA Compliance', 'SEC Regulations', 'KYC/AML', 'Tax Optimization'],
        availability: 'available',
        rating: 4.9,
        reviews: []
      },
      {
        owner: '0x3456789012345678901234567890123456789012',
        agentType: 'advisor',
        name: 'Oracle - Risk Prophet',
        description: 'AI-powered risk prediction with <1s response time. Prevents losses through advanced volatility forecasting.',
        hourlyRate: 60,
        stakingRequirement: 6000,
        performanceScore: 91,
        totalEarnings: 67000,
        hiredCount: 203,
        isActive: true,
        specialties: ['Risk Modeling', 'Volatility Prediction', 'Market Analysis', 'Crisis Detection'],
        availability: 'busy',
        rating: 4.7,
        reviews: []
      },
      {
        owner: '0x4567890123456789012345678901234567890123',
        agentType: 'supervisor',
        name: 'Sage - Ethics Guardian',
        description: 'Bias detection and AI ethics specialist. Ensures fair and unbiased decision-making across all agents.',
        hourlyRate: 45,
        stakingRequirement: 4500,
        performanceScore: 96,
        totalEarnings: 34000,
        hiredCount: 89,
        isActive: true,
        specialties: ['Bias Detection', 'AI Ethics', 'Model Auditing', 'Fairness Metrics'],
        availability: 'available',
        rating: 4.9,
        reviews: []
      }
    ]

    demoAgents.forEach((agent, index) => {
      const id = `agent_${index + 1}`
      this.listings.set(id, { ...agent, id })
    })
  }

  async listAgent(agentData: Omit<AgentListing, 'id' | 'totalEarnings' | 'hiredCount' | 'reviews'>): Promise<string> {
    const id = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const listing: AgentListing = {
      ...agentData,
      id,
      totalEarnings: 0,
      hiredCount: 0,
      reviews: []
    }

    this.listings.set(id, listing)
    
    // In production, would interact with USDM contract
    // await this.usdmContract.listAgent(agentData.agentType, agentData.hourlyRate, agentData.stakingRequirement)
    
    this.emit('agentListed', listing)
    console.log(`[Marketplace] Agent ${listing.name} listed successfully`)
    
    return id
  }

  async hireAgent(agentId: string, duration: number, deliverables: string[]): Promise<string> {
    const agent = this.listings.get(agentId)
    if (!agent) {
      throw new Error('Agent not found')
    }

    if (!agent.isActive) {
      throw new Error('Agent is not available')
    }

    const totalCost = agent.hourlyRate * duration
    const contractId = `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create milestones (25% upfront, 75% on completion for simplicity)
    const milestones: Milestone[] = [
      {
        description: 'Contract initiation',
        payment: totalCost * 0.25,
        completed: false
      },
      {
        description: 'Project completion',
        payment: totalCost * 0.75,
        completed: false
      }
    ]

    const contract: HiringContract = {
      id: contractId,
      agentId,
      hirer: '0x' + Math.random().toString(16).substr(2, 40), // Mock hirer address
      duration,
      totalCost,
      startTime: new Date(),
      status: 'pending',
      deliverables,
      milestones
    }

    this.contracts.set(contractId, contract)

    // Update agent status
    agent.availability = 'busy'
    
    // In production, would interact with USDM contract
    // await this.usdmContract.hireAgent(agentId, duration)
    
    this.emit('agentHired', { contract, agent })
    console.log(`[Marketplace] Agent ${agent.name} hired for ${duration} hours`)
    
    return contractId
  }

  async completeContract(contractId: string, rating: number, review?: string): Promise<void> {
    const contract = this.contracts.get(contractId)
    if (!contract) {
      throw new Error('Contract not found')
    }

    const agent = this.listings.get(contract.agentId)
    if (!agent) {
      throw new Error('Agent not found')
    }

    // Complete all milestones
    contract.milestones.forEach(milestone => {
      milestone.completed = true
      milestone.timestamp = new Date()
    })

    contract.status = 'completed'
    
    // Update agent stats
    agent.hiredCount += 1
    agent.totalEarnings += contract.totalCost
    agent.availability = 'available'
    
    // Add review
    if (review) {
      agent.reviews.push({
        reviewer: contract.hirer,
        rating,
        comment: review,
        timestamp: new Date(),
        verified: true
      })
      
      // Update overall rating
      const totalRating = agent.reviews.reduce((sum, r) => sum + r.rating, 0)
      agent.rating = totalRating / agent.reviews.length
    }

    // Distribute USDM rewards
    await this.distributeRewards(contract)
    
    this.emit('contractCompleted', { contract, agent })
    console.log(`[Marketplace] Contract ${contractId} completed successfully`)
  }

  private async distributeRewards(contract: HiringContract): Promise<void> {
    // Distribute rewards to various stakeholders
    const rewards = {
      agentOwner: contract.totalCost * 0.85, // 85% to agent owner
      platform: contract.totalCost * 0.05,   // 5% platform fee
      stakers: contract.totalCost * 0.10      // 10% to USDM stakers
    }

    console.log(`[Rewards] Distributing ${contract.totalCost} USDM tokens:`)
    console.log(`  - Agent Owner: ${rewards.agentOwner} USDM`)
    console.log(`  - Platform Fee: ${rewards.platform} USDM`)
    console.log(`  - Staker Rewards: ${rewards.stakers} USDM`)
    
    // In production, would execute actual token transfers
    this.emit('rewardsDistributed', rewards)
  }

  async updateAgentPerformance(agentId: string, performanceScore: number): Promise<void> {
    const agent = this.listings.get(agentId)
    if (!agent) {
      throw new Error('Agent not found')
    }

    agent.performanceScore = performanceScore
    
    // Suspend agent if performance is too low
    if (performanceScore < 50) {
      agent.isActive = false
      agent.availability = 'offline'
      console.log(`[Marketplace] Agent ${agent.name} suspended due to low performance`)
    }

    this.emit('performanceUpdated', { agentId, performanceScore })
  }

  async searchAgents(filters: {
    agentType?: AgentType
    minRating?: number
    maxHourlyRate?: number
    availability?: string
    specialties?: string[]
  }): Promise<AgentListing[]> {
    let results = Array.from(this.listings.values())

    if (filters.agentType) {
      results = results.filter(agent => agent.agentType === filters.agentType)
    }

    if (filters.minRating) {
      results = results.filter(agent => agent.rating >= filters.minRating)
    }

    if (filters.maxHourlyRate) {
      results = results.filter(agent => agent.hourlyRate <= filters.maxHourlyRate)
    }

    if (filters.availability) {
      results = results.filter(agent => agent.availability === filters.availability)
    }

    if (filters.specialties && filters.specialties.length > 0) {
      results = results.filter(agent => 
        filters.specialties!.some(specialty => 
          agent.specialties.includes(specialty)
        )
      )
    }

    // Sort by rating and performance
    results.sort((a, b) => {
      const scoreA = (a.rating * 0.6) + (a.performanceScore * 0.004) // Normalize performance score
      const scoreB = (b.rating * 0.6) + (b.performanceScore * 0.004)
      return scoreB - scoreA
    })

    return results
  }

  getAgentById(agentId: string): AgentListing | undefined {
    return this.listings.get(agentId)
  }

  getContractById(contractId: string): HiringContract | undefined {
    return this.contracts.get(contractId)
  }

  getAllAgents(): AgentListing[] {
    return Array.from(this.listings.values())
  }

  getActiveContracts(): HiringContract[] {
    return Array.from(this.contracts.values()).filter(contract => 
      contract.status === 'active' || contract.status === 'pending'
    )
  }

  getMarketplaceStats() {
    const agents = Array.from(this.listings.values())
    const contracts = Array.from(this.contracts.values())
    
    return {
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.isActive).length,
      totalContracts: contracts.length,
      completedContracts: contracts.filter(c => c.status === 'completed').length,
      totalVolume: contracts.reduce((sum, c) => sum + c.totalCost, 0),
      averageRating: agents.reduce((sum, a) => sum + a.rating, 0) / agents.length,
      topPerformers: agents
        .filter(a => a.hiredCount > 0)
        .sort((a, b) => b.performanceScore - a.performanceScore)
        .slice(0, 5)
        .map(a => ({ name: a.name, score: a.performanceScore, earnings: a.totalEarnings }))
    }
  }
}

export const agentMarketplace = new AgentMarketplace()
