// Core Types for SentinelAI 4.0
export interface Agent {
  id: string
  name: string
  type: AgentType
  status: AgentStatus
  capabilities: string[]
  performance: AgentPerformance
  zkProofHash?: string
}

export enum AgentType {
  TRADER = "trader",
  COMPLIANCE = "compliance",
  SUPERVISOR = "supervisor",
  ADVISOR = "advisor",
}

export enum AgentStatus {
  ACTIVE = "active",
  IDLE = "idle",
  LEARNING = "learning",
  SUSPENDED = "suspended",
}

export interface AgentPerformance {
  successRate: number
  avgResponseTime: number
  decisionsCount: number
  lastActive: Date
}

export interface Decision {
  id: string
  agentId: string
  timestamp: Date
  action: string
  rationale: string
  confidence: number
  zkProof: ZKProof
  impact: DecisionImpact
}

export interface ZKProof {
  proof: string
  publicSignals: string[]
  verificationKey: string
  circuitId: string
}

export interface DecisionImpact {
  treasuryChange: number
  riskScore: number
  complianceScore: number
  gasUsed?: number
}

export interface DAOTreasury {
  id: string
  name: string
  totalValue: number
  assets: Asset[]
  riskProfile: RiskProfile
  governance: GovernanceConfig
}

export interface Asset {
  symbol: string
  amount: number
  value: number
  chain: string
  contractAddress?: string
}

export interface RiskProfile {
  volatilityTolerance: number
  maxDrawdown: number
  diversificationTarget: number
  complianceLevel: ComplianceLevel
}

export enum ComplianceLevel {
  BASIC = "basic",
  MICA = "mica",
  SEC = "sec",
  FULL = "full",
}

export interface GovernanceConfig {
  votingThreshold: number
  proposalDelay: number
  executionDelay: number
  aiOverrideEnabled: boolean
}

export interface CrisisEvent {
  id: string
  type: CrisisType
  severity: number
  timestamp: Date
  description: string
  aiResponse: Decision[]
  humanOverride?: boolean
}

export enum CrisisType {
  FLASH_CRASH = "flash_crash",
  FRAUD_DETECTION = "fraud_detection",
  COMPLIANCE_BREACH = "compliance_breach",
  BRIDGE_EXPLOIT = "bridge_exploit",
}

export interface FederatedLearningBatch {
  id: string
  participants: string[]
  modelUpdate: string
  accuracy: number
  privacyBudget: number
  timestamp: Date
}
