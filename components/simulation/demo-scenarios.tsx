"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Shield, Brain, Globe, Users, ChevronRight, CheckCircle, AlertCircle } from "lucide-react"

interface DemoStep {
  id: string
  title: string
  description: string
  duration: number
  status: "pending" | "running" | "completed" | "failed"
  result?: any
}

export function DemoScenarios() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [demoSteps, setDemoSteps] = useState<DemoStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)

  const demoScenarios = [
    {
      id: "portfolio_optimization",
      title: "AI Portfolio Optimization",
      description: "Watch SentinelAI optimize a $10M treasury portfolio in real-time",
      icon: TrendingUp,
      color: "text-green-400",
      steps: [
        {
          id: "analyze_portfolio",
          title: "Portfolio Analysis",
          description: "AI agents analyze current portfolio composition and risk metrics",
          duration: 3000,
        },
        {
          id: "identify_opportunities",
          title: "Opportunity Identification",
          description: "Identify yield farming and arbitrage opportunities across chains",
          duration: 4000,
        },
        {
          id: "risk_assessment",
          title: "Risk Assessment",
          description: "Evaluate risks and generate compliance reports",
          duration: 2000,
        },
        {
          id: "execute_rebalancing",
          title: "Execute Rebalancing",
          description: "Execute optimal rebalancing with ZK-proof verification",
          duration: 5000,
        },
      ],
    },
    {
      id: "threat_detection",
      title: "Threat Detection & Response",
      description: "Demonstrate real-time threat detection and automated response",
      icon: Shield,
      color: "text-red-400",
      steps: [
        {
          id: "monitor_transactions",
          title: "Transaction Monitoring",
          description: "Monitor all treasury transactions for suspicious patterns",
          duration: 2000,
        },
        {
          id: "detect_anomaly",
          title: "Anomaly Detection",
          description: "AI detects unusual transaction pattern indicating potential attack",
          duration: 3000,
        },
        {
          id: "emergency_response",
          title: "Emergency Response",
          description: "Automatically pause affected operations and alert stakeholders",
          duration: 1500,
        },
        {
          id: "forensic_analysis",
          title: "Forensic Analysis",
          description: "Generate detailed incident report with XAI explanations",
          duration: 4000,
        },
      ],
    },
    {
      id: "cross_chain_arbitrage",
      title: "Cross-Chain Arbitrage",
      description: "Execute profitable arbitrage opportunities across multiple blockchains",
      icon: Globe,
      color: "text-blue-400",
      steps: [
        {
          id: "scan_opportunities",
          title: "Opportunity Scanning",
          description: "Scan for arbitrage opportunities across Ethereum, Polygon, and Cardano",
          duration: 3500,
        },
        {
          id: "calculate_profitability",
          title: "Profitability Analysis",
          description: "Calculate net profitability accounting for gas fees and slippage",
          duration: 2500,
        },
        {
          id: "execute_trades",
          title: "Execute Trades",
          description: "Execute simultaneous trades across multiple chains",
          duration: 6000,
        },
        {
          id: "verify_profit",
          title: "Profit Verification",
          description: "Verify successful arbitrage and update treasury records",
          duration: 2000,
        },
      ],
    },
    {
      id: "governance_participation",
      title: "Intelligent Governance",
      description: "AI-powered governance participation and proposal analysis",
      icon: Users,
      color: "text-purple-400",
      steps: [
        {
          id: "analyze_proposals",
          title: "Proposal Analysis",
          description: "Analyze active governance proposals across connected DAOs",
          duration: 4000,
        },
        {
          id: "sentiment_analysis",
          title: "Sentiment Analysis",
          description: "Analyze community sentiment and voting patterns",
          duration: 3000,
        },
        {
          id: "generate_recommendation",
          title: "Voting Recommendation",
          description: "Generate voting recommendations with XAI explanations",
          duration: 2500,
        },
        {
          id: "cast_votes",
          title: "Cast Votes",
          description: "Automatically cast votes based on DAO strategy and risk tolerance",
          duration: 3500,
        },
      ],
    },
  ]

  const startDemo = async (demoId: string) => {
    const demo = demoScenarios.find((d) => d.id === demoId)
    if (!demo) return

    setActiveDemo(demoId)
    setCurrentStep(0)

    const steps: DemoStep[] = demo.steps.map((step) => ({
      ...step,
      status: "pending",
    }))

    setDemoSteps(steps)

    // Execute steps sequentially
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i)
      setDemoSteps((prev) => prev.map((step, index) => (index === i ? { ...step, status: "running" } : step)))

      // Simulate step execution
      await new Promise((resolve) => setTimeout(resolve, steps[i].duration))

      // Generate mock result
      const result = generateMockResult(steps[i].id)

      setDemoSteps((prev) => prev.map((step, index) => (index === i ? { ...step, status: "completed", result } : step)))
    }

    console.log(`[v0] Demo ${demoId} completed successfully`)
  }

  const generateMockResult = (stepId: string) => {
    switch (stepId) {
      case "analyze_portfolio":
        return { totalValue: "$10.2M", riskScore: 0.65, diversification: 0.82 }
      case "identify_opportunities":
        return { opportunities: 12, potentialYield: "8.5%", confidence: 0.91 }
      case "detect_anomaly":
        return { threatLevel: "High", confidence: 0.94, affectedAssets: "$250K" }
      case "scan_opportunities":
        return { opportunities: 5, bestSpread: "2.3%", estimatedProfit: "$45K" }
      case "analyze_proposals":
        return { activeProposals: 8, relevantProposals: 3, avgSentiment: 0.72 }
      default:
        return { success: true, timestamp: Date.now() }
    }
  }

  const resetDemo = () => {
    setActiveDemo(null)
    setDemoSteps([])
    setCurrentStep(0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Interactive Demos</h2>
          <p className="text-muted-foreground">Experience SentinelAI's capabilities through guided demonstrations</p>
        </div>
        {activeDemo && (
          <Button onClick={resetDemo} variant="outline">
            Reset Demo
          </Button>
        )}
      </div>

      {activeDemo ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {demoScenarios.find((d) => d.id === activeDemo)?.title}
            </CardTitle>
            <CardDescription>
              Step {currentStep + 1} of {demoSteps.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={((currentStep + 1) / demoSteps.length) * 100} className="h-2" />

            <div className="space-y-4">
              {demoSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0">
                    {step.status === "completed" && <CheckCircle className="h-6 w-6 text-green-500" />}
                    {step.status === "running" && (
                      <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    )}
                    {step.status === "pending" && (
                      <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    {step.status === "failed" && <AlertCircle className="h-6 w-6 text-red-500" />}
                  </div>

                  <div className="flex-1">
                    <div className="font-medium text-foreground">{step.title}</div>
                    <div className="text-sm text-muted-foreground">{step.description}</div>
                    {step.result && (
                      <div className="mt-2 text-xs text-primary">Result: {JSON.stringify(step.result)}</div>
                    )}
                  </div>

                  <Badge
                    variant={
                      step.status === "completed"
                        ? "default"
                        : step.status === "running"
                          ? "secondary"
                          : step.status === "failed"
                            ? "destructive"
                            : "outline"
                    }
                  >
                    {step.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoScenarios.map((demo) => {
            const IconComponent = demo.icon
            return (
              <Card key={demo.id} className="hover:shadow-lg transition-all cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <IconComponent className={`h-6 w-6 ${demo.color}`} />
                    {demo.title}
                  </CardTitle>
                  <CardDescription>{demo.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Demo Steps</div>
                    <div className="space-y-1">
                      {demo.steps.slice(0, 3).map((step, index) => (
                        <div key={step.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ChevronRight className="h-3 w-3" />
                          {step.title}
                        </div>
                      ))}
                      {demo.steps.length > 3 && (
                        <div className="text-xs text-muted-foreground ml-5">+{demo.steps.length - 3} more steps</div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => startDemo(demo.id)}
                    className="w-full group-hover:bg-primary/90 transition-colors"
                  >
                    Start Demo
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
