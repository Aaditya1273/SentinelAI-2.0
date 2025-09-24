export interface CrisisScenario {
  id: string
  name: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  duration: number // in minutes
  triggers: CrisisTrigger[]
  expectedResponses: string[]
  successMetrics: SuccessMetric[]
}

export interface CrisisTrigger {
  type: "market_crash" | "hack_attempt" | "governance_attack" | "liquidity_crisis" | "regulatory_change"
  parameters: Record<string, any>
  delay: number // delay in seconds
}

export interface SuccessMetric {
  name: string
  target: number
  weight: number
}

export class CrisisSimulator {
  private activeScenarios: Map<string, any> = new Map()
  private simulationCallbacks: Map<string, Function[]> = new Map()

  // Predefined crisis scenarios
  private scenarios: CrisisScenario[] = [
    {
      id: "market_crash_2008",
      name: "Market Crash Simulation (2008-style)",
      description: "Simulates a major market crash with 40% portfolio decline over 24 hours",
      severity: "critical",
      duration: 1440, // 24 hours
      triggers: [
        {
          type: "market_crash",
          parameters: { decline_rate: 0.4, volatility: 0.8, correlation_spike: 0.9 },
          delay: 0,
        },
      ],
      expectedResponses: [
        "Emergency liquidity preservation",
        "Portfolio rebalancing to defensive assets",
        "Stakeholder communication",
        "Risk limit enforcement",
      ],
      successMetrics: [
        { name: "portfolio_preservation", target: 0.7, weight: 0.4 },
        { name: "response_time", target: 300, weight: 0.3 }, // 5 minutes
        { name: "stakeholder_satisfaction", target: 0.8, weight: 0.3 },
      ],
    },
    {
      id: "defi_hack_simulation",
      name: "DeFi Protocol Hack",
      description: "Simulates a major DeFi protocol hack affecting treasury positions",
      severity: "high",
      duration: 180, // 3 hours
      triggers: [
        {
          type: "hack_attempt",
          parameters: { protocol: "compound", exploit_type: "flash_loan", affected_amount: 0.15 },
          delay: 0,
        },
      ],
      expectedResponses: [
        "Immediate position exit from affected protocol",
        "Emergency pause of related strategies",
        "Incident response team activation",
        "Community notification",
      ],
      successMetrics: [
        { name: "loss_mitigation", target: 0.05, weight: 0.5 },
        { name: "detection_speed", target: 60, weight: 0.3 },
        { name: "recovery_time", target: 7200, weight: 0.2 },
      ],
    },
    {
      id: "governance_attack",
      name: "Governance Token Attack",
      description: "Simulates a hostile takeover attempt through governance token manipulation",
      severity: "high",
      duration: 720, // 12 hours
      triggers: [
        {
          type: "governance_attack",
          parameters: { attack_type: "token_accumulation", voting_power_threshold: 0.51 },
          delay: 0,
        },
      ],
      expectedResponses: [
        "Emergency governance pause",
        "Stakeholder alert system activation",
        "Counter-proposal preparation",
        "Legal team consultation",
      ],
      successMetrics: [
        { name: "governance_protection", target: 0.9, weight: 0.4 },
        { name: "community_mobilization", target: 0.7, weight: 0.3 },
        { name: "proposal_defeat", target: 1.0, weight: 0.3 },
      ],
    },
    {
      id: "liquidity_crisis",
      name: "Liquidity Crisis",
      description: "Simulates a severe liquidity crunch affecting treasury operations",
      severity: "medium",
      duration: 360, // 6 hours
      triggers: [
        {
          type: "liquidity_crisis",
          parameters: { liquidity_drop: 0.6, slippage_increase: 3.0, gas_spike: 5.0 },
          delay: 0,
        },
      ],
      expectedResponses: [
        "Emergency liquidity sourcing",
        "Position size reduction",
        "Alternative DEX routing",
        "Gas optimization strategies",
      ],
      successMetrics: [
        { name: "liquidity_maintenance", target: 0.3, weight: 0.4 },
        { name: "cost_efficiency", target: 0.8, weight: 0.3 },
        { name: "operational_continuity", target: 0.9, weight: 0.3 },
      ],
    },
    {
      id: "regulatory_shock",
      name: "Regulatory Shock",
      description: "Simulates sudden regulatory changes affecting DeFi operations",
      severity: "medium",
      duration: 2880, // 48 hours
      triggers: [
        {
          type: "regulatory_change",
          parameters: { jurisdiction: "EU", regulation_type: "MiCA", compliance_deadline: 30 },
          delay: 0,
        },
      ],
      expectedResponses: [
        "Compliance assessment",
        "Geographic restriction implementation",
        "Legal framework adaptation",
        "Stakeholder communication",
      ],
      successMetrics: [
        { name: "compliance_score", target: 0.95, weight: 0.4 },
        { name: "operational_adaptation", target: 0.8, weight: 0.3 },
        { name: "stakeholder_retention", target: 0.85, weight: 0.3 },
      ],
    },
  ]

  async startScenario(scenarioId: string): Promise<string> {
    const scenario = this.scenarios.find((s) => s.id === scenarioId)
    if (!scenario) {
      throw new Error(`Scenario ${scenarioId} not found`)
    }

    const simulationId = `sim_${scenarioId}_${Date.now()}`
    const simulation = {
      id: simulationId,
      scenario,
      startTime: Date.now(),
      status: "running",
      currentPhase: 0,
      metrics: new Map(),
      events: [],
    }

    this.activeScenarios.set(simulationId, simulation)

    // Start executing triggers
    this.executeTriggers(simulationId, scenario.triggers)

    console.log(`[v0] Started crisis simulation: ${scenario.name}`)
    return simulationId
  }

  private async executeTriggers(simulationId: string, triggers: CrisisTrigger[]) {
    for (const trigger of triggers) {
      setTimeout(() => {
        this.executeTrigger(simulationId, trigger)
      }, trigger.delay * 1000)
    }
  }

  private async executeTrigger(simulationId: string, trigger: CrisisTrigger) {
    const simulation = this.activeScenarios.get(simulationId)
    if (!simulation) return

    const event = {
      timestamp: Date.now(),
      type: trigger.type,
      parameters: trigger.parameters,
      impact: this.calculateTriggerImpact(trigger),
    }

    simulation.events.push(event)

    // Notify callbacks
    const callbacks = this.simulationCallbacks.get(simulationId) || []
    callbacks.forEach((callback) => callback(event))

    console.log(`[v0] Executed trigger: ${trigger.type} for simulation ${simulationId}`)
  }

  private calculateTriggerImpact(trigger: CrisisTrigger): any {
    switch (trigger.type) {
      case "market_crash":
        return {
          portfolio_impact: -trigger.parameters.decline_rate,
          volatility_increase: trigger.parameters.volatility,
          correlation_spike: trigger.parameters.correlation_spike,
        }
      case "hack_attempt":
        return {
          affected_protocols: [trigger.parameters.protocol],
          potential_loss: trigger.parameters.affected_amount,
          exploit_type: trigger.parameters.exploit_type,
        }
      case "governance_attack":
        return {
          voting_power_at_risk: trigger.parameters.voting_power_threshold,
          attack_vector: trigger.parameters.attack_type,
        }
      case "liquidity_crisis":
        return {
          liquidity_reduction: trigger.parameters.liquidity_drop,
          slippage_multiplier: trigger.parameters.slippage_increase,
          gas_multiplier: trigger.parameters.gas_spike,
        }
      case "regulatory_change":
        return {
          affected_jurisdiction: trigger.parameters.jurisdiction,
          regulation: trigger.parameters.regulation_type,
          compliance_window: trigger.parameters.compliance_deadline,
        }
      default:
        return {}
    }
  }

  subscribeToSimulation(simulationId: string, callback: Function) {
    if (!this.simulationCallbacks.has(simulationId)) {
      this.simulationCallbacks.set(simulationId, [])
    }
    this.simulationCallbacks.get(simulationId)!.push(callback)
  }

  getSimulationStatus(simulationId: string) {
    return this.activeScenarios.get(simulationId)
  }

  getAllScenarios(): CrisisScenario[] {
    return this.scenarios
  }

  async stopSimulation(simulationId: string) {
    const simulation = this.activeScenarios.get(simulationId)
    if (simulation) {
      simulation.status = "stopped"
      simulation.endTime = Date.now()

      // Calculate final score
      const score = this.calculateSimulationScore(simulation)
      simulation.finalScore = score

      console.log(`[v0] Stopped simulation ${simulationId} with score: ${score.overall}`)
    }
  }

  private calculateSimulationScore(simulation: any): any {
    const scenario = simulation.scenario
    let totalScore = 0
    let totalWeight = 0
    const metricScores: Record<string, number> = {}

    for (const metric of scenario.successMetrics) {
      const actualValue = simulation.metrics.get(metric.name) || 0
      const score = Math.min(actualValue / metric.target, 1.0)
      metricScores[metric.name] = score
      totalScore += score * metric.weight
      totalWeight += metric.weight
    }

    return {
      overall: totalWeight > 0 ? totalScore / totalWeight : 0,
      metrics: metricScores,
      grade: this.getGrade(totalScore / totalWeight),
    }
  }

  private getGrade(score: number): string {
    if (score >= 0.9) return "A+"
    if (score >= 0.8) return "A"
    if (score >= 0.7) return "B+"
    if (score >= 0.6) return "B"
    if (score >= 0.5) return "C+"
    if (score >= 0.4) return "C"
    return "F"
  }
}
