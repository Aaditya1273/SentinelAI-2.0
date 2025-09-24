// Base Agent Class with XAI Capabilities
import { EventEmitter } from "events"
import type { Decision, AgentType, AgentStatus } from "@/types"

export abstract class BaseAgent extends EventEmitter {
  protected id: string
  protected name: string
  protected type: AgentType
  protected status: AgentStatus = "idle" as AgentStatus
  protected capabilities: string[]
  protected performance: {
    successRate: number
    avgResponseTime: number
    decisionsCount: number
    lastActive: Date
  }
  protected learningData: any[] = []
  protected biasDetectionEnabled = true

  constructor(id: string, name: string, type: AgentType, capabilities: string[]) {
    super()
    this.id = id
    this.name = name
    this.type = type
    this.capabilities = capabilities
    this.performance = {
      successRate: 0.95,
      avgResponseTime: 500,
      decisionsCount: 0,
      lastActive: new Date(),
    }
  }

  // Abstract methods that must be implemented by specific agents
  abstract processData(data: any): Promise<any>
  abstract makeDecision(context: any): Promise<Decision>
  abstract explainDecision(decision: Decision): string

  // Common XAI functionality
  protected generateXAIExplanation(
    decision: string,
    confidence: number,
    factors: { factor: string; weight: number; impact: string }[],
  ): string {
    const topFactors = factors
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .map((f) => `${f.factor} (${(f.weight * 100).toFixed(1)}% weight): ${f.impact}`)
      .join("; ")

    return `${decision} with ${confidence}% confidence. Key factors: ${topFactors}. Analysis verified through ZK-proof validation.`
  }

  // Bias detection and mitigation
  protected async detectBias(decisionData: any): Promise<{ hasBias: boolean; biasType?: string; severity?: number }> {
    console.log(`[${this.name}] Running bias detection analysis...`)

    // Simulate bias detection algorithm
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Mock bias detection - in production would use actual ML bias detection
    const biasScore = Math.random()
    const hasBias = biasScore > 0.8 // 20% chance of detecting bias

    if (hasBias) {
      const biasTypes = ["confirmation_bias", "anchoring_bias", "availability_bias", "recency_bias"]
      return {
        hasBias: true,
        biasType: biasTypes[Math.floor(Math.random() * biasTypes.length)],
        severity: biasScore,
      }
    }

    return { hasBias: false }
  }

  // Federated learning participation
  protected async participateInFederatedLearning(globalModel: any): Promise<any> {
    console.log(`[${this.name}] Participating in federated learning round...`)

    // Simulate local model training
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Generate mock model update
    const modelUpdate = {
      agentId: this.id,
      weights: Array(10)
        .fill(0)
        .map(() => Math.random() - 0.5),
      accuracy: 0.85 + Math.random() * 0.1,
      dataPoints: this.learningData.length,
      timestamp: new Date(),
    }

    console.log(`[${this.name}] Generated model update with accuracy: ${modelUpdate.accuracy.toFixed(3)}`)
    return modelUpdate
  }

  // Edge AI processing for <1s predictions
  protected async edgePredict(
    inputData: any,
  ): Promise<{ prediction: any; confidence: number; processingTime: number }> {
    const startTime = Date.now()

    // Simulate edge AI processing (optimized for speed)
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 800 + 100)) // 100-900ms

    const processingTime = Date.now() - startTime
    const prediction = this.generateMockPrediction(inputData)
    const confidence = 0.7 + Math.random() * 0.3

    console.log(`[${this.name}] Edge prediction completed in ${processingTime}ms`)
    return { prediction, confidence, processingTime }
  }

  protected generateMockPrediction(inputData: any): any {
    // Mock prediction based on agent type
    const predictions = {
      trader: { action: "rebalance", allocation: { ETH: 0.6, USDC: 0.3, DeFi: 0.1 } },
      compliance: { compliant: true, riskLevel: "low", requiredActions: [] },
      supervisor: { agentHealth: "good", biasDetected: false, recommendedActions: [] },
      advisor: { riskScore: 0.3, volatilityPrediction: 0.15, timeHorizon: "24h" },
    }

    return predictions[this.type as keyof typeof predictions] || { status: "processed" }
  }

  // Performance tracking
  updatePerformance(success: boolean, responseTime: number): void {
    this.performance.decisionsCount++
    this.performance.lastActive = new Date()
    this.performance.avgResponseTime =
      (this.performance.avgResponseTime * (this.performance.decisionsCount - 1) + responseTime) /
      this.performance.decisionsCount

    if (success) {
      this.performance.successRate =
        (this.performance.successRate * (this.performance.decisionsCount - 1) + 1) / this.performance.decisionsCount
    } else {
      this.performance.successRate =
        (this.performance.successRate * (this.performance.decisionsCount - 1)) / this.performance.decisionsCount
    }
  }

  // Data unlearning for privacy and bias removal
  async unlearnData(dataToRemove: any[]): Promise<void> {
    console.log(`[${this.name}] Initiating data unlearning for ${dataToRemove.length} samples...`)

    // Remove specified data from learning dataset
    this.learningData = this.learningData.filter(
      (item) => !dataToRemove.some((remove) => this.dataMatches(item, remove)),
    )

    // Simulate model retraining without the removed data
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log(`[${this.name}] Data unlearning completed. Remaining samples: ${this.learningData.length}`)
    this.emit("dataUnlearned", { agentId: this.id, removedCount: dataToRemove.length })
  }

  private dataMatches(item1: any, item2: any): boolean {
    // Simple matching logic - in production would use more sophisticated comparison
    return JSON.stringify(item1) === JSON.stringify(item2)
  }

  // Getters
  getId(): string {
    return this.id
  }

  getName(): string {
    return this.name
  }

  getType(): AgentType {
    return this.type
  }

  getStatus(): AgentStatus {
    return this.status
  }

  getPerformance() {
    return { ...this.performance }
  }

  getCapabilities(): string[] {
    return [...this.capabilities]
  }

  // Status management
  activate(): void {
    this.status = "active" as AgentStatus
    this.emit("statusChanged", { agentId: this.id, status: this.status })
  }

  deactivate(): void {
    this.status = "idle" as AgentStatus
    this.emit("statusChanged", { agentId: this.id, status: this.status })
  }

  suspend(): void {
    this.status = "suspended" as AgentStatus
    this.emit("statusChanged", { agentId: this.id, status: this.status })
  }
}
