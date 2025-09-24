// Compliance Agent - MiCA/SEC compliance, XAI explanations
import { BaseAgent } from "./base-agent"
import type { Decision, AgentType } from "@/types"
import { zkProofSystem } from "@/lib/zk-proofs"

export class ComplianceAgent extends BaseAgent {
  private regulatoryRules: Map<string, any> = new Map()
  private complianceHistory: any[] = []
  private jurisdictionData: any = {}

  constructor(id: string) {
    super(id, "ComplianceAgent", "compliance" as AgentType, [
      "mica_compliance",
      "sec_compliance",
      "kyc_verification",
      "aml_monitoring",
      "regulatory_reporting",
      "xai_explanations",
    ])

    this.initializeRegulatoryRules()
  }

  private initializeRegulatoryRules(): void {
    // MiCA (Markets in Crypto-Assets) Rules
    this.regulatoryRules.set("MiCA", {
      maxTransactionAmount: 1000000, // €1M
      kycRequirements: {
        individual: 10000, // €10k threshold
        institutional: 50000, // €50k threshold
      },
      reportingThreshold: 100000, // €100k
      stablecoinReserves: 0.98, // 98% backing requirement
      operationalResilience: true,
    })

    // SEC Rules
    this.regulatoryRules.set("SEC", {
      accreditedInvestorOnly: true,
      maxRetailInvestment: 250000, // $250k
      disclosureRequirements: ["risk_factors", "financial_statements", "governance"],
      custodyRequirements: true,
      auditRequirements: "annual",
    })

    // General AML/KYC
    this.regulatoryRules.set("AML", {
      suspiciousActivityThreshold: 10000,
      sanctionsScreening: true,
      recordKeeping: "5_years",
      riskAssessment: "quarterly",
    })
  }

  async processData(data: any): Promise<any> {
    console.log(`[${this.name}] Processing compliance data...`)

    // Update jurisdiction data
    this.jurisdictionData = data.jurisdictions || {
      primary: "EU",
      secondary: ["US", "UK", "SG"],
      restricted: ["CN", "KP", "IR"],
    }

    // Analyze compliance status
    const complianceAnalysis = await this.analyzeCompliance(data)

    // Check for regulatory updates
    const regulatoryUpdates = await this.checkRegulatoryUpdates()

    // Generate compliance report
    const complianceReport = await this.generateComplianceReport(complianceAnalysis)

    return {
      complianceStatus: complianceAnalysis,
      regulatoryUpdates,
      complianceReport,
      riskAssessment: await this.assessComplianceRisk(data),
    }
  }

  async makeDecision(context: any): Promise<Decision> {
    const startTime = Date.now()

    // Analyze compliance requirements
    const complianceAnalysis = await this.analyzeComplianceRequirements(context)

    // Generate compliance decision
    const decision = await this.generateComplianceDecision(complianceAnalysis)

    // Verify decision against all applicable regulations
    const regulatoryCheck = await this.verifyAgainstRegulations(decision)

    if (!regulatoryCheck.compliant) {
      console.log(`[${this.name}] Compliance violation detected, adjusting decision...`)
      decision.action = regulatoryCheck.correctedAction
      decision.confidence *= 0.8 // Reduce confidence for corrected decisions
    }

    // Generate ZK proof for compliance verification
    const zkProof = await zkProofSystem.generateComplianceProof("MiCA", decision.complianceScore)

    const processingTime = Date.now() - startTime
    this.updatePerformance(regulatoryCheck.compliant, processingTime)

    const finalDecision: Decision = {
      id: `compliance_${Date.now()}_${this.id}`,
      agentId: this.id,
      timestamp: new Date(),
      action: decision.action,
      rationale: this.explainDecision(decision as any),
      confidence: decision.confidence / 100,
      zkProof,
      impact: {
        treasuryChange: 0, // Compliance decisions don't directly change treasury
        riskScore: decision.riskReduction,
        complianceScore: decision.complianceScore,
        gasUsed: decision.estimatedGas,
      },
    }

    this.emit("complianceDecision", finalDecision)
    return finalDecision
  }

  explainDecision(decision: any): string {
    const factors = [
      {
        factor: "Regulatory Compliance Check",
        weight: 0.4,
        impact: `${decision.regulationsChecked} regulations verified, ${decision.violationsFound} violations found`,
      },
      {
        factor: "KYC/AML Verification",
        weight: 0.25,
        impact: `${decision.kycStatus} KYC status, AML risk score: ${decision.amlRiskScore}`,
      },
      {
        factor: "Jurisdiction Analysis",
        weight: 0.2,
        impact: `Operating in ${decision.jurisdictions.length} jurisdictions, ${decision.restrictedJurisdictions} restricted`,
      },
      {
        factor: "Transaction Monitoring",
        weight: 0.15,
        impact: `${decision.suspiciousTransactions} suspicious activities flagged, ${decision.reportingRequired} reports required`,
      },
    ]

    return this.generateXAIExplanation(decision.action, decision.confidence, factors)
  }

  private async analyzeCompliance(data: any): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 250))

    const micaCompliance = await this.checkMiCACompliance(data)
    const secCompliance = await this.checkSECCompliance(data)
    const amlCompliance = await this.checkAMLCompliance(data)

    return {
      overall: (micaCompliance.score + secCompliance.score + amlCompliance.score) / 3,
      mica: micaCompliance,
      sec: secCompliance,
      aml: amlCompliance,
      lastUpdated: new Date(),
    }
  }

  private async checkMiCACompliance(data: any): Promise<any> {
    const rules = this.regulatoryRules.get("MiCA")
    let score = 1.0
    const violations: string[] = []

    // Check transaction limits
    if (data.transactionAmount > rules.maxTransactionAmount) {
      violations.push("Transaction exceeds MiCA limit")
      score -= 0.3
    }

    // Check KYC requirements
    if (data.userType === "individual" && data.amount > rules.kycRequirements.individual && !data.kycVerified) {
      violations.push("KYC verification required for individual")
      score -= 0.4
    }

    // Check stablecoin reserves (if applicable)
    if (data.assetType === "stablecoin" && data.reserveRatio < rules.stablecoinReserves) {
      violations.push("Insufficient stablecoin reserves")
      score -= 0.5
    }

    return {
      score: Math.max(0, score),
      violations,
      requirements: ["KYC verification", "Transaction reporting", "Reserve backing"],
    }
  }

  private async checkSECCompliance(data: any): Promise<any> {
    const rules = this.regulatoryRules.get("SEC")
    let score = 1.0
    const violations: string[] = []

    // Check accredited investor requirement
    if (rules.accreditedInvestorOnly && !data.accreditedInvestor) {
      violations.push("Non-accredited investor not permitted")
      score -= 0.6
    }

    // Check investment limits
    if (!data.accreditedInvestor && data.amount > rules.maxRetailInvestment) {
      violations.push("Investment exceeds retail limit")
      score -= 0.4
    }

    // Check disclosure requirements
    const missingDisclosures = rules.disclosureRequirements.filter((req: string) => !data.disclosures?.includes(req))
    if (missingDisclosures.length > 0) {
      violations.push(`Missing disclosures: ${missingDisclosures.join(", ")}`)
      score -= 0.2 * missingDisclosures.length
    }

    return {
      score: Math.max(0, score),
      violations,
      requirements: ["Accredited investor verification", "Proper disclosures", "Custody compliance"],
    }
  }

  private async checkAMLCompliance(data: any): Promise<any> {
    const rules = this.regulatoryRules.get("AML")
    let score = 1.0
    const violations: string[] = []

    // Check suspicious activity threshold
    if (data.amount > rules.suspiciousActivityThreshold && !data.sarFiled) {
      violations.push("Suspicious Activity Report required")
      score -= 0.3
    }

    // Check sanctions screening
    if (rules.sanctionsScreening && !data.sanctionsScreened) {
      violations.push("Sanctions screening not performed")
      score -= 0.4
    }

    // Check restricted jurisdictions
    if (data.jurisdiction && this.jurisdictionData.restricted?.includes(data.jurisdiction)) {
      violations.push("Transaction from restricted jurisdiction")
      score -= 0.8
    }

    return {
      score: Math.max(0, score),
      violations,
      requirements: ["Sanctions screening", "SAR filing", "Record keeping"],
    }
  }

  private async analyzeComplianceRequirements(context: any): Promise<any> {
    // Use edge AI for fast compliance analysis
    const edgeResult = await this.edgePredict(context)

    return {
      applicableRegulations: ["MiCA", "SEC", "AML"],
      riskLevel: edgeResult.prediction.riskLevel || "medium",
      requiredActions: edgeResult.prediction.requiredActions || [],
      timelineRequirements: {
        immediate: ["sanctions_screening"],
        within_24h: ["transaction_reporting"],
        within_7d: ["compliance_review"],
      },
    }
  }

  private async generateComplianceDecision(analysis: any): Promise<any> {
    const decision = {
      action: this.generateComplianceAction(analysis),
      confidence: 85 + Math.floor(Math.random() * 15), // 85-100% confidence
      complianceScore: 0.9 + Math.random() * 0.1, // 90-100% compliance
      riskReduction: Math.random() * 0.1, // 0-10% risk reduction
      estimatedGas: Math.floor(Math.random() * 50000) + 25000,
      regulationsChecked: analysis.applicableRegulations.length,
      violationsFound: Math.floor(Math.random() * 2), // 0-1 violations
      kycStatus: "verified",
      amlRiskScore: Math.random() * 0.3, // 0-30% AML risk
      jurisdictions: this.jurisdictionData.secondary || [],
      restrictedJurisdictions: 0,
      suspiciousTransactions: Math.floor(Math.random() * 3),
      reportingRequired: Math.floor(Math.random() * 2),
    }

    return decision
  }

  private generateComplianceAction(analysis: any): string {
    const actions = [
      "Verified MiCA compliance for EU operations with 98.5% compliance score",
      "Updated KYC requirements to meet new regulatory standards",
      "Filed Suspicious Activity Report for transaction exceeding threshold",
      "Implemented enhanced due diligence for high-risk jurisdictions",
      "Generated regulatory report for quarterly compliance review",
      "Updated privacy policy to comply with GDPR requirements",
    ]

    return actions[Math.floor(Math.random() * actions.length)]
  }

  private async verifyAgainstRegulations(decision: any): Promise<any> {
    // Simulate regulatory verification
    await new Promise((resolve) => setTimeout(resolve, 100))

    const compliant = Math.random() > 0.1 // 90% compliance rate
    const correctedAction = compliant
      ? decision.action
      : "Suspended transaction pending additional compliance verification"

    return {
      compliant,
      correctedAction,
      checkedRegulations: ["MiCA", "SEC", "AML"],
      violationsFound: compliant ? 0 : 1,
    }
  }

  private async checkRegulatoryUpdates(): Promise<any[]> {
    // Simulate checking for regulatory updates
    await new Promise((resolve) => setTimeout(resolve, 200))

    return [
      {
        regulation: "MiCA",
        update: "New stablecoin reserve requirements effective Q2 2025",
        impact: "medium",
        deadline: "2025-06-01",
      },
      {
        regulation: "SEC",
        update: "Updated custody requirements for digital assets",
        impact: "high",
        deadline: "2025-03-15",
      },
    ]
  }

  private async generateComplianceReport(analysis: any): Promise<any> {
    return {
      reportId: `compliance_${Date.now()}`,
      period: "Q1 2025",
      overallScore: analysis.overall,
      keyFindings: [
        "98.5% compliance rate across all jurisdictions",
        "Zero critical violations identified",
        "Enhanced KYC procedures implemented",
      ],
      recommendations: [
        "Update privacy policy for new GDPR requirements",
        "Implement automated sanctions screening",
        "Enhance transaction monitoring algorithms",
      ],
      nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    }
  }

  private async assessComplianceRisk(data: any): Promise<any> {
    return {
      overallRisk: "low",
      riskFactors: [
        { factor: "Jurisdiction risk", level: "low", score: 0.2 },
        { factor: "Transaction volume risk", level: "medium", score: 0.4 },
        { factor: "Regulatory change risk", level: "low", score: 0.1 },
      ],
      mitigationStrategies: [
        "Continuous regulatory monitoring",
        "Enhanced due diligence procedures",
        "Regular compliance training",
      ],
    }
  }
}
