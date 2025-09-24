// Advisor Agent - Risk prediction, Edge AI, Federated Learning
import { BaseAgent } from "./base-agent"
import type { Decision, AgentType, CrisisEvent, CrisisType } from "@/types"
import { zkProofSystem } from "@/lib/zk-proofs"

export class AdvisorAgent extends BaseAgent {
  private riskModels: Map<string, any> = new Map()
  private marketData: any = {}
  private predictionHistory: any[] = []
  private federatedLearningRounds: any[] = []

  constructor(id: string) {
    super(id, "AdvisorAgent", "advisor" as AgentType, [
      "risk_prediction",
      "market_analysis",
      "edge_ai",
      "federated_learning",
      "crisis_detection",
      "volatility_forecasting",
    ])

    this.initializeRiskModels()
  }

  private initializeRiskModels(): void {
    // Initialize various risk prediction models
    this.riskModels.set("VaR", {
      name: "Value at Risk",
      confidence: 0.95,
      timeHorizon: "1d",
      accuracy: 0.87,
    })

    this.riskModels.set("CVaR", {
      name: "Conditional Value at Risk",
      confidence: 0.99,
      timeHorizon: "1d",
      accuracy: 0.84,
    })

    this.riskModels.set("volatility", {
      name: "GARCH Volatility Model",
      lookback: 30,
      accuracy: 0.82,
    })

    this.riskModels.set("correlation", {
      name: "Dynamic Correlation Model",
      window: 60,
      accuracy: 0.79,
    })
  }

  async processData(data: any): Promise<any> {
    console.log(`[${this.name}] Processing market and risk data...`)

    // Update market data
    this.marketData = {
      prices: data.prices || this.generateMockPrices(),
      volumes: data.volumes || this.generateMockVolumes(),
      volatility: data.volatility || this.calculateVolatility(),
      correlations: data.correlations || this.calculateCorrelations(),
      macroIndicators: data.macroIndicators || this.getMacroIndicators(),
      timestamp: new Date(),
    }

    // Perform risk analysis
    const riskAnalysis = await this.performRiskAnalysis()

    // Generate market predictions
    const marketPredictions = await this.generateMarketPredictions()

    // Detect potential crisis scenarios
    const crisisDetection = await this.detectCrisisScenarios()

    // Participate in federated learning
    const federatedUpdate = await this.participateInFederatedLearning(data.globalModel)

    return {
      riskAnalysis,
      marketPredictions,
      crisisDetection,
      federatedUpdate,
      modelPerformance: await this.evaluateModelPerformance(),
    }
  }

  async makeDecision(context: any): Promise<Decision> {
    const startTime = Date.now()

    // Perform edge AI risk prediction (<1s requirement)
    const riskPrediction = await this.edgePredict(context)

    // Generate advisory decision
    const decision = await this.generateAdvisoryDecision(riskPrediction)

    // Validate prediction accuracy against historical data
    const accuracyCheck = await this.validatePredictionAccuracy(decision)

    if (accuracyCheck.accuracy < 0.8) {
      console.log(`[${this.name}] Low prediction accuracy detected, adjusting confidence...`)
      decision.confidence *= accuracyCheck.accuracy
    }

    // Generate ZK proof for risk prediction
    const zkProof = await zkProofSystem.generateDecisionProof(this.id, decision.action, decision.confidence / 100)

    const processingTime = Date.now() - startTime
    this.updatePerformance(processingTime < 1000, processingTime) // Success if <1s

    const finalDecision: Decision = {
      id: `advisor_${Date.now()}_${this.id}`,
      agentId: this.id,
      timestamp: new Date(),
      action: decision.action,
      rationale: this.explainDecision(decision as any),
      confidence: decision.confidence / 100,
      zkProof,
      impact: {
        treasuryChange: 0, // Advisory decisions don't directly change treasury
        riskScore: decision.riskImpact,
        complianceScore: 0.95,
        gasUsed: decision.estimatedGas,
      },
    }

    // Store prediction for accuracy tracking
    this.predictionHistory.push({
      prediction: decision,
      timestamp: new Date(),
      actualOutcome: null, // To be updated later
    })

    this.emit("riskPrediction", finalDecision)
    return finalDecision
  }

  explainDecision(decision: any): string {
    const factors = [
      {
        factor: "Market Volatility Analysis",
        weight: 0.3,
        impact: `${decision.volatilityLevel} volatility detected, ${decision.volatilityTrend} trend over ${decision.timeHorizon}`,
      },
      {
        factor: "Risk Model Ensemble",
        weight: 0.25,
        impact: `VaR: ${decision.var}%, CVaR: ${decision.cvar}%, combined confidence: ${decision.modelConfidence}%`,
      },
      {
        factor: "Crisis Probability Assessment",
        weight: 0.25,
        impact: `${decision.crisisType} risk: ${decision.crisisProbability}%, severity: ${decision.crisisSeverity}`,
      },
      {
        factor: "Federated Learning Insights",
        weight: 0.2,
        impact: `Consensus from ${decision.federatedPeers} DAOs, accuracy: ${decision.federatedAccuracy}%`,
      },
    ]

    return this.generateXAIExplanation(decision.action, decision.confidence, factors)
  }

  private async performRiskAnalysis(): Promise<any> {
    console.log(`[${this.name}] Performing comprehensive risk analysis...`)

    await new Promise((resolve) => setTimeout(resolve, 200))

    const varAnalysis = await this.calculateVaR()
    const volatilityAnalysis = await this.analyzeVolatility()
    const correlationAnalysis = await this.analyzeCorrelations()
    const liquidityAnalysis = await this.analyzeLiquidity()

    return {
      var: varAnalysis,
      volatility: volatilityAnalysis,
      correlation: correlationAnalysis,
      liquidity: liquidityAnalysis,
      overallRiskScore: this.calculateOverallRiskScore([varAnalysis, volatilityAnalysis, correlationAnalysis]),
      riskTrend: this.calculateRiskTrend(),
    }
  }

  private async calculateVaR(): Promise<any> {
    // Simulate VaR calculation
    const confidence = 0.95
    const timeHorizon = 1 // 1 day

    return {
      value: 0.05 + Math.random() * 0.1, // 5-15% VaR
      confidence,
      timeHorizon,
      method: "Historical Simulation",
      backtestAccuracy: 0.87,
    }
  }

  private async analyzeVolatility(): Promise<any> {
    const currentVol = 0.15 + Math.random() * 0.2 // 15-35% annualized
    const historicalAvg = 0.25
    const trend = currentVol > historicalAvg ? "increasing" : "decreasing"

    return {
      current: currentVol,
      historical: historicalAvg,
      trend,
      forecast24h: currentVol * (0.9 + Math.random() * 0.2), // ±10% change
      garchPrediction: currentVol * (0.95 + Math.random() * 0.1),
    }
  }

  private async analyzeCorrelations(): Promise<any> {
    return {
      btcEthCorrelation: 0.6 + Math.random() * 0.3, // 60-90%
      cryptoStockCorrelation: 0.3 + Math.random() * 0.4, // 30-70%
      averageCorrelation: 0.45 + Math.random() * 0.2,
      correlationTrend: Math.random() > 0.5 ? "increasing" : "decreasing",
      diversificationBenefit: 0.2 + Math.random() * 0.3, // 20-50%
    }
  }

  private async analyzeLiquidity(): Promise<any> {
    return {
      marketDepth: 0.8 + Math.random() * 0.2, // 80-100%
      bidAskSpread: 0.001 + Math.random() * 0.004, // 0.1-0.5%
      liquidityScore: 0.75 + Math.random() * 0.25,
      liquidityRisk: Math.random() * 0.3, // 0-30%
    }
  }

  private async generateMarketPredictions(): Promise<any> {
    console.log(`[${this.name}] Generating market predictions using edge AI...`)

    // Use edge AI for fast predictions
    const edgeResult = await this.edgePredict(this.marketData)

    return {
      priceDirection: Math.random() > 0.5 ? "bullish" : "bearish",
      priceTarget: {
        "24h": (1 + (Math.random() - 0.5) * 0.1) * 2000, // ±5% from $2000
        "7d": (1 + (Math.random() - 0.5) * 0.2) * 2000, // ±10% from $2000
        "30d": (1 + (Math.random() - 0.5) * 0.4) * 2000, // ±20% from $2000
      },
      confidence: edgeResult.confidence,
      processingTime: edgeResult.processingTime,
      keyDrivers: ["institutional_adoption", "regulatory_clarity", "macro_environment"],
    }
  }

  private async detectCrisisScenarios(): Promise<any> {
    console.log(`[${this.name}] Detecting potential crisis scenarios...`)

    await new Promise((resolve) => setTimeout(resolve, 150))

    const crisisTypes: CrisisType[] = ["flash_crash", "fraud_detection", "compliance_breach", "bridge_exploit"]
    const detectedCrises = []

    for (const crisisType of crisisTypes) {
      const probability = Math.random() * 0.3 // 0-30% probability
      const severity = Math.random() * 0.8 + 0.2 // 20-100% severity

      if (probability > 0.15) {
        // Only report crises with >15% probability
        detectedCrises.push({
          type: crisisType,
          probability,
          severity,
          timeframe: "24-48h",
          indicators: this.getCrisisIndicators(crisisType),
          mitigationStrategies: this.getCrisisMitigation(crisisType),
        })
      }
    }

    return {
      totalCrisesDetected: detectedCrises.length,
      highProbabilityCrises: detectedCrises.filter((c) => c.probability > 0.25),
      detectedCrises,
      overallCrisisRisk: detectedCrises.reduce((sum, c) => sum + c.probability * c.severity, 0),
    }
  }

  private getCrisisIndicators(crisisType: CrisisType): string[] {
    const indicators = {
      flash_crash: ["High volatility spike", "Unusual volume patterns", "Liquidity drainage"],
      fraud_detection: ["Anomalous transaction patterns", "Suspicious wallet behavior", "Smart contract exploits"],
      compliance_breach: ["Regulatory announcement", "Jurisdiction restrictions", "KYC violations"],
      bridge_exploit: ["Cross-chain anomalies", "Bridge contract vulnerabilities", "Oracle manipulation"],
    }

    return indicators[crisisType] || ["General market stress"]
  }

  private getCrisisMitigation(crisisType: CrisisType): string[] {
    const strategies = {
      flash_crash: ["Implement circuit breakers", "Increase stable allocation", "Reduce leverage"],
      fraud_detection: ["Freeze suspicious accounts", "Enhanced monitoring", "Emergency audit"],
      compliance_breach: ["Legal consultation", "Compliance review", "Jurisdiction exit"],
      bridge_exploit: ["Pause bridge operations", "Security audit", "Fund recovery"],
    }

    return strategies[crisisType] || ["General risk mitigation"]
  }

  private async generateAdvisoryDecision(riskPrediction: any): Promise<any> {
    const decision = {
      action: this.generateAdvisoryAction(riskPrediction),
      confidence: 80 + Math.floor(Math.random() * 20), // 80-100% confidence
      riskImpact: (Math.random() - 0.5) * 0.2, // ±10% risk impact
      estimatedGas: Math.floor(Math.random() * 40000) + 20000,
      volatilityLevel: Math.random() > 0.5 ? "high" : "moderate",
      volatilityTrend: Math.random() > 0.5 ? "increasing" : "stable",
      timeHorizon: "24h",
      var: (5 + Math.random() * 10).toFixed(1), // 5-15% VaR
      cvar: (8 + Math.random() * 12).toFixed(1), // 8-20% CVaR
      modelConfidence: 85 + Math.floor(Math.random() * 15),
      crisisType: ["flash_crash", "market_correction", "liquidity_crisis"][Math.floor(Math.random() * 3)],
      crisisProbability: Math.floor(Math.random() * 30), // 0-30%
      crisisSeverity: Math.random() > 0.7 ? "high" : "moderate",
      federatedPeers: 12 + Math.floor(Math.random() * 8), // 12-20 peers
      federatedAccuracy: 82 + Math.floor(Math.random() * 18), // 82-100%
    }

    return decision
  }

  private generateAdvisoryAction(riskPrediction: any): string {
    const actions = [
      "Predicted 15% volatility spike in next 24h - recommend defensive positioning",
      "Flash crash probability elevated to 25% - suggest implementing circuit breakers",
      "Cross-asset correlation increasing - diversification benefits reduced by 30%",
      "Liquidity conditions deteriorating - recommend reducing position sizes by 20%",
      "Federated learning consensus suggests market correction - prepare hedging strategies",
      "Edge AI detected anomalous patterns - enhanced monitoring recommended",
    ]

    return actions[Math.floor(Math.random() * actions.length)]
  }

  private async validatePredictionAccuracy(decision: any): Promise<any> {
    // Simulate accuracy validation against historical performance
    await new Promise((resolve) => setTimeout(resolve, 50))

    const accuracy = 0.75 + Math.random() * 0.25 // 75-100% accuracy
    const historicalPerformance = this.calculateHistoricalAccuracy()

    return {
      accuracy,
      historicalPerformance,
      confidenceAdjustment: accuracy < 0.8 ? accuracy : 1.0,
      validationMethod: "Backtesting",
    }
  }

  private calculateHistoricalAccuracy(): number {
    if (this.predictionHistory.length === 0) return 0.85 // Default for new agent

    const accurateCount = this.predictionHistory.filter((pred) => pred.actualOutcome === "accurate").length
    return accurateCount / this.predictionHistory.length
  }

  private calculateOverallRiskScore(analyses: any[]): number {
    // Weighted average of different risk measures
    const weights = [0.4, 0.3, 0.3] // VaR, volatility, correlation
    let weightedSum = 0

    analyses.forEach((analysis, index) => {
      const score = this.normalizeRiskScore(analysis)
      weightedSum += score * weights[index]
    })

    return Math.min(1.0, Math.max(0.0, weightedSum))
  }

  private normalizeRiskScore(analysis: any): number {
    // Normalize different risk measures to 0-1 scale
    if (analysis.value) return Math.min(1.0, analysis.value / 0.2) // VaR normalization
    if (analysis.current) return Math.min(1.0, analysis.current / 0.5) // Volatility normalization
    if (analysis.averageCorrelation) return analysis.averageCorrelation // Already 0-1
    return 0.5 // Default
  }

  private calculateRiskTrend(): string {
    // Analyze trend over recent predictions
    if (this.predictionHistory.length < 3) return "stable"

    const recentScores = this.predictionHistory.slice(-3).map((pred) => pred.prediction.riskImpact || 0)

    const trend = recentScores[2] - recentScores[0]
    if (trend > 0.05) return "increasing"
    if (trend < -0.05) return "decreasing"
    return "stable"
  }

  private generateMockPrices(): any {
    return {
      ETH: 2000 + (Math.random() - 0.5) * 200,
      BTC: 45000 + (Math.random() - 0.5) * 5000,
      USDC: 1.0,
      AAVE: 100 + (Math.random() - 0.5) * 20,
    }
  }

  private generateMockVolumes(): any {
    return {
      ETH: 1000000 + Math.random() * 500000,
      BTC: 2000000 + Math.random() * 1000000,
      USDC: 500000 + Math.random() * 200000,
      AAVE: 100000 + Math.random() * 50000,
    }
  }

  private calculateVolatility(): number {
    return 0.15 + Math.random() * 0.2 // 15-35% annualized
  }

  private calculateCorrelations(): any {
    return {
      "ETH-BTC": 0.6 + Math.random() * 0.3,
      "ETH-AAVE": 0.4 + Math.random() * 0.4,
      "BTC-AAVE": 0.3 + Math.random() * 0.4,
    }
  }

  private getMacroIndicators(): any {
    return {
      fedRate: 0.05,
      inflationRate: 0.03,
      vixLevel: 20 + Math.random() * 15,
      dxyLevel: 100 + Math.random() * 10,
      goldPrice: 2000 + Math.random() * 200,
    }
  }

  private async evaluateModelPerformance(): Promise<any> {
    return {
      overallAccuracy: this.calculateHistoricalAccuracy(),
      modelScores: {
        VaR: 0.87,
        volatility: 0.82,
        correlation: 0.79,
        crisis_detection: 0.91,
      },
      processingSpeed: {
        average: 450, // ms
        p95: 800, // ms
        p99: 950, // ms
      },
      federatedLearningRounds: this.federatedLearningRounds.length,
      lastModelUpdate: new Date(),
    }
  }

  // Public methods for external interaction
  async predictCrisis(timeframe = "24h"): Promise<CrisisEvent[]> {
    const crisisDetection = await this.detectCrisisScenarios()

    return crisisDetection.detectedCrises.map((crisis: any) => ({
      id: `crisis_${Date.now()}_${crisis.type}`,
      type: crisis.type,
      severity: crisis.severity,
      timestamp: new Date(),
      description: `${crisis.type} detected with ${(crisis.probability * 100).toFixed(1)}% probability`,
      aiResponse: [], // To be filled by other agents
      humanOverride: false,
    }))
  }

  getPredictionHistory(): any[] {
    return [...this.predictionHistory]
  }

  getFederatedLearningHistory(): any[] {
    return [...this.federatedLearningRounds]
  }
}
