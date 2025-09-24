"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Play, Square, TrendingDown, Shield, Zap } from "lucide-react"
import Link from "next/link"

export function CrisisSimulation() {
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null)
  const [simulationProgress, setSimulationProgress] = useState(0)

  const quickScenarios = [
    {
      id: "market_crash",
      name: "Market Crash",
      description: "Simulate 30% market decline",
      severity: "high",
      duration: "15 min",
      icon: TrendingDown,
    },
    {
      id: "security_breach",
      name: "Security Breach",
      description: "Test incident response protocols",
      severity: "critical",
      duration: "10 min",
      icon: Shield,
    },
    {
      id: "liquidity_crisis",
      name: "Liquidity Crisis",
      description: "Simulate low liquidity conditions",
      severity: "medium",
      duration: "20 min",
      icon: Zap,
    },
  ]

  const startQuickSimulation = (scenarioId: string) => {
    setActiveSimulation(scenarioId)
    setSimulationProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setSimulationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setActiveSimulation(null)
          return 0
        }
        return prev + 10
      })
    }, 1000)
  }

  const stopSimulation = () => {
    setActiveSimulation(null)
    setSimulationProgress(0)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-400" />
          Crisis Simulation
        </CardTitle>
        <CardDescription>Test system responses to various crisis scenarios</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Simulation Status */}
        {activeSimulation && (
          <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="font-medium">
                  {quickScenarios.find((s) => s.id === activeSimulation)?.name} Running
                </span>
              </div>
              <Button onClick={stopSimulation} size="sm" variant="outline">
                <Square className="h-3 w-3 mr-1" />
                Stop
              </Button>
            </div>
            <Progress value={simulationProgress} className="h-2" />
            <div className="text-xs text-muted-foreground mt-2">Progress: {simulationProgress}%</div>
          </div>
        )}

        {/* Quick Scenarios */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Quick Scenarios</h4>
          <div className="space-y-2">
            {quickScenarios.map((scenario) => {
              const IconComponent = scenario.icon
              return (
                <div key={scenario.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">{scenario.name}</div>
                      <div className="text-xs text-muted-foreground">{scenario.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(scenario.severity)} variant="secondary">
                      {scenario.severity}
                    </Badge>
                    <Button
                      onClick={() => startQuickSimulation(scenario.id)}
                      disabled={!!activeSimulation}
                      size="sm"
                      variant="outline"
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Simulation Results */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Recent Results</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded bg-muted/30">
              <span className="text-sm">Market Crash Simulation</span>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Grade: A
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/30">
              <span className="text-sm">Liquidity Crisis Test</span>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Grade: B+
              </Badge>
            </div>
          </div>
        </div>

        {/* Full Simulation Center Link */}
        <div className="pt-4 border-t border-border">
          <Button asChild className="w-full">
            <Link href="/simulation">Open Full Simulation Center</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
